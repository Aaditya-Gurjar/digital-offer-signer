import React, { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const SignOffer = () => {
  const sigCanvas = useRef(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get email from URL
  const [searchParams] = useSearchParams();
  useEffect(() => {
    setEmail(searchParams.get("email"));
  }, [searchParams]);

  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  const saveSignature = async () => {
    if (!sigCanvas.current.isEmpty()) {
      setIsSubmitting(true);

      const signatureImage = sigCanvas.current.toDataURL("image/png");

      try {
        const response = await axios.post(
          "http://localhost:5000/api/offers/sign-offer",
          {
            email,
            signature: signatureImage,
          }
        );
        console.log("response:", response);

        setMessage(
          "Signature submitted successfully! Check your email for the signed offer letter."
        );
      } catch (error) {
        console.error("Error submitting signature:", error);
        setMessage("Error submitting signature. Please try again.");
      }

      setIsSubmitting(false);
    } else {
      setMessage("Please sign before submitting.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Sign Your Offer Letter</h2>
      <p>Email: {email}</p>

      <SignatureCanvas
        ref={sigCanvas}
        penColor="black"
        canvasProps={{
          width: 500,
          height: 200,
          className: "sigCanvas",
          style: { border: "2px solid black" },
        }}
      />

      <br />
      <button onClick={clearSignature} style={{ marginRight: "10px" }}>
        Clear
      </button>
      <button onClick={saveSignature} disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Signature"}
      </button>

      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default SignOffer;
