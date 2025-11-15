import React, { useEffect, useRef, useState } from "react";
import { BoardSpace, Property, Question } from "../types";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { lineNumbers } from "@codemirror/view";
import { bracketMatching } from "@codemirror/matchbrackets";
import { closeBrackets } from "@codemirror/autocomplete";
import { history } from "@codemirror/commands";
import { keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import "./PurchaseModal.css";

interface PurchaseModalProps {
  space: BoardSpace | null;
  property: Property | null;
  question: Question | null;
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => void;
  onDecline: () => void;
  backendUrl?: string;
}

interface TestResult {
  success: boolean;
  valid: boolean;
  output: string;
  error?: string;
  test_result?: {
    message: string;
    tests?: Record<string, boolean>;
  };
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  space,
  property,
  question,
  isOpen,
  onClose,
  onPurchase,
  onDecline,
  backendUrl = "http://localhost:5001",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [code, setCode] = useState("");
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  // Initialize editor when modal opens
  useEffect(() => {
    if (isOpen && editorRef.current && !viewRef.current) {
      try {
        // Create extensions fresh each time to avoid instance conflicts
        const updateListener = EditorView.updateListener.of((update) => {
          if (update.docChanged && viewRef.current) {
            const newCode = viewRef.current.state.doc.toString();
            setCode(newCode);
          }
        });

        const allExtensions = [
          lineNumbers(),
          bracketMatching(),
          closeBrackets(),
          history(),
          keymap.of(defaultKeymap),
          python(),
          oneDark,
          updateListener,
        ];

        const view = new EditorView({
          state: EditorState.create({
            doc: "",
            extensions: allExtensions,
          }),
          parent: editorRef.current,
        });

        viewRef.current = view;
        setCode("");

        // Focus the editor
        setTimeout(() => {
          if (viewRef.current) {
            viewRef.current.focus();
          }
        }, 100);
      } catch (error) {
        console.error("Error creating CodeMirror editor:", error);
      }
    }

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, [isOpen]);

  // Don't update editor content automatically - let user type their code

  // Cleanup when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCode("");
      setTestResult(null);
      setSelectedAnswer("");
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    }
  }, [isOpen]);

  const handleTestCode = async () => {
    // Handle multiple choice questions
    if (question?.question_type === "multiple_choice") {
      if (!selectedAnswer) {
        setTestResult({
          success: false,
          valid: false,
          output: "",
          error: "Please select an answer",
        });
        return;
      }

      setIsTesting(true);
      try {
        const response = await fetch(`${backendUrl}/test-code`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: selectedAnswer,
            question_id: question?.question_id || "",
          }),
        });

        const result: TestResult = await response.json();
        setTestResult(result);
      } catch (error) {
        setTestResult({
          success: false,
          valid: false,
          output: "",
          error: `Connection error: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        });
      } finally {
        setIsTesting(false);
      }
      return;
    }

    // Handle coding questions
    if (!code.trim()) {
      setTestResult({
        success: false,
        valid: false,
        output: "",
        error: "Please write some code first",
      });
      return;
    }

    setIsTesting(true);
    try {
      const response = await fetch(`${backendUrl}/test-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          question_id: question?.question_id || "",
        }),
      });

      const result: TestResult = await response.json();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        valid: false,
        output: "",
        error: `Connection error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleClear = () => {
    if (viewRef.current) {
      try {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: viewRef.current.state.doc.length,
            insert: "",
          },
        });
        setCode("");
        setTestResult(null);
      } catch (error) {
        console.error("Error clearing editor:", error);
      }
    }
  };

  if (!isOpen || !space) return null;

  const cost =
    property?.property_cost ||
    (space.space_category === "railroad"
      ? 200
      : space.space_category === "utility"
      ? 150
      : 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content purchase-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2>Purchase {space.space_title}</h2>

        {property && (
          <div className="property-details">
            <div className="detail-row">
              <span className="detail-label">Cost:</span>
              <span className="detail-value">${property.property_cost}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Base Rent:</span>
              <span className="detail-value">${property.base_rent}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Rent with Group:</span>
              <span className="detail-value">${property.rent_with_group}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Rent with 1 House:</span>
              <span className="detail-value">
                ${property.rent_with_1_house}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Rent with 2 Houses:</span>
              <span className="detail-value">
                ${property.rent_with_2_house}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">House Cost:</span>
              <span className="detail-value">${property.house_cost}</span>
            </div>
          </div>
        )}

        {!property && (
          <div className="property-details">
            <div className="detail-row">
              <span className="detail-label">Cost:</span>
              <span className="detail-value">${cost}</span>
            </div>
          </div>
        )}

        {question && (
          <div className="challenge-section">
            <h3>Challenge Question</h3>
            <p className="question-text">{question.question}</p>

            {question.question_type === "multiple_choice" &&
            question.options ? (
              <div className="multiple-choice-container">
                <div className="options-list">
                  {question.options.map((option, index) => (
                    <label
                      key={index}
                      className={`option-label ${
                        selectedAnswer === option.split(".")[0].trim()
                          ? "selected"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={option.split(".")[0].trim()}
                        checked={selectedAnswer === option.split(".")[0].trim()}
                        onChange={(e) => setSelectedAnswer(e.target.value)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
                <button
                  className="btn btn-primary"
                  onClick={handleTestCode}
                  disabled={isTesting || !selectedAnswer}
                >
                  {isTesting ? "Checking..." : "Check Answer"}
                </button>
              </div>
            ) : (
              <div className="code-editor-container">
                <div className="editor-header">
                  <span>Python Code Editor</span>
                  <div className="editor-buttons">
                    <button className="btn btn-small" onClick={handleClear}>
                      Clear
                    </button>
                    <button
                      className="btn btn-small btn-primary"
                      onClick={handleTestCode}
                      disabled={isTesting}
                    >
                      {isTesting ? "Testing..." : "Test Code"}
                    </button>
                  </div>
                </div>
                <div ref={editorRef} className="code-editor"></div>
              </div>
            )}

            {testResult && (
              <div
                className={`test-result ${
                  testResult.success ? "success" : "error"
                }`}
              >
                <h4>Test Result</h4>
                {testResult.success ? (
                  <div className="result-success">
                    <p>✓ Code executed successfully!</p>
                    {testResult.valid && <p>✓ Validation passed!</p>}
                    {testResult.output && (
                      <div className="output-container">
                        <strong>Output:</strong>
                        <pre>{testResult.output}</pre>
                      </div>
                    )}
                    {testResult.test_result && (
                      <div className="test-details">
                        <p>{testResult.test_result.message}</p>
                        {testResult.test_result.tests && (
                          <ul>
                            {Object.entries(testResult.test_result.tests).map(
                              ([test, passed]) => (
                                <li
                                  key={test}
                                  className={passed ? "test-pass" : "test-fail"}
                                >
                                  {passed ? "✓" : "✗"} {test}
                                </li>
                              )
                            )}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="result-error">
                    <p>✗ {testResult.error || "Test failed"}</p>
                    {testResult.output && (
                      <div className="output-container">
                        <strong>Output:</strong>
                        <pre>{testResult.output}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onDecline}>
            Decline
          </button>
          <button
            className="btn btn-primary"
            onClick={onPurchase}
            disabled={
              question
                ? question.question_type === "multiple_choice"
                  ? !(testResult?.success && testResult?.valid)
                  : !(testResult?.success && testResult?.valid)
                : false
            }
          >
            Purchase for ${cost}
          </button>
        </div>
      </div>
    </div>
  );
};
