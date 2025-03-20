


const puppeteer = require("puppeteer");
const Offer = require("../models/OfferModel");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const OfferModel = require("../models/OfferModel");
const { v4: uuidv4 } = require("uuid");
const { baseUrl, FrontEndbaseUrl } = require("../utils/config");



// // Create and send HTML offer email
// exports.createOffer = async (req, res) => {
//     try {
//         const { userEmail, userName, position, salary } = req.body;

//         // Create and save new offer with a unique tracking token
//         const offer = new Offer({
//             userEmail,
//             userName,
//             position,
//             salary,

//         });
//         await offer.save();
//         const offerId = offer._id;
//        

//         const trackEmail = `http://localhost:5000/track-email/${offerId}`;

//         const signatureLink = `http://localhost:5173/sign-offer?email=${encodeURIComponent(userEmail)}`;

//         const emailHTML = `
//       <html>
//       <head>
//         <style>
//           body { font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 30px; }
//           .container { 
//               background: #fff; 
//               padding: 20px; 
//               border-radius: 10px; 
//               box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); 
//               width: 500px; 
//               margin: auto; 
//           }
//           h2 { color: #333; }
//           p { font-size: 16px; color: #666; }
//           .btn {
//               display: inline-block;
//               background: #007bff;
//               color: #fff;
//               padding: 12px 20px;
//               text-decoration: none;
//               font-size: 16px;
//               border-radius: 5px;
//               margin-top: 20px;
//               transition: background 0.3s ease;
//           }
//           .btn:hover { background: #0056b3; }
//         </style>
//       </head>
//       <body>
//         <!-- Tracking Pixel (invisible) -->
//         <img src="${trackEmail}" width="1" height="1" style="display:none;" alt="">
//         <div class="container">
//           <h2>Offer Letter for ${userName}</h2>
//           <p>Dear <strong>${userName}</strong>,</p>
//           <p>We are pleased to offer you the position of <strong>${position}</strong> with a salary of <strong>${salary}</strong>.</p>
//           <p>Please click the button below to review and sign your offer letter.</p>
//           <a href="${signatureLink}" class="btn">Sign Here</a>
//         </div>
//       </body>
//       </html>
//     `;


//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
//         });


//         await transporter.sendMail({
//             from: process.env.EMAIL_USER,
//             to: userEmail,
//             subject: "Your Offer Letter - Signature Required",
//             html: emailHTML,
//         });

//         res.status(200).json({ message: "Offer Letter Sent!", offer });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error generating offer letter" });
//     }
// };



exports.createOffer = async (req, res) => {
  try {
    const { userEmail, userName, position, salary } = req.body;

    // Create and save new offer with a unique tracking token
    const offer = new Offer({
      userEmail,
      userName,
      position,
      salary,

    });
    await offer.save();
    const offerId = offer._id;
    console.log("Offer ID:", offerId);


    // const trackEmail = `http://localhost:5000/track-email/${offerId}`;
    const signatureLink = `${FrontEndbaseUrl}sign-offer?email=${encodeURIComponent(userEmail)}`;



    const offerFolder = path.join(__dirname, "../offers");
    if (!fs.existsSync(offerFolder)) {
      fs.mkdirSync(offerFolder, { recursive: true });
    }
    const pdfPath = path.join(offerFolder, `${userEmail}_offer.pdf`);

    // Create HTML content for the PDF with a logo at the top and detailed description with policy points
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .header img { width: 150px; }
            .content { margin: 20px; }
            .content h1 { color: #333; }
            .content p { font-size: 16px; color: #555; line-height: 1.5; }
            .policy { margin-top: 20px; }
            .policy h3 { color: #007bff; }
            .policy ul { list-style-type: disc; padding-left: 20px; }
            .btn { 
              display: inline-block; 
              background: #007bff; 
              color: #fff; 
              padding: 10px 20px; 
              text-decoration: none; 
              border-radius: 5px;
              margin-top: 20px;
            }
            .footer { margin-top: 40px; font-size: 12px; color: #777; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT99XVSieJwmWcAjaxxFhdHPoCi-Jof0u4eWA&s" alt="Company Logo">
          </div>
          <div class="content">
            <h1>Offer Letter for ${userName}</h1>
            <p>Dear ${userName},</p>
            <p>
              We are delighted to offer you the position of <strong>${position}</strong> with an annual salary of <strong>${salary}</strong>.
              Below are the detailed terms and policies that govern your employment:
            </p>
            <h2>Offer Details</h2>
            <p>
              Your role is integral to our team and involves responsibilities that align with our company’s mission of innovation and excellence.
              We expect you to adhere to the highest standards of professionalism and ethical behavior.
            </p>
            <div class="policy">
              <h3>Key Policy Points:</h3>
              <ul>
                <li><strong>Confidentiality:</strong> All proprietary information must be kept confidential.</li>
                <li><strong>Non-Disclosure:</strong> You are required to sign a non-disclosure agreement regarding company trade secrets.</li>
                <li><strong>Code of Conduct:</strong> Maintain professionalism and respect in all interactions.</li>
                <li><strong>Performance Reviews:</strong> Regular performance evaluations will help monitor and foster your growth.</li>
                <li><strong>Compliance:</strong> Adhere to all company policies, legal regulations, and industry standards.</li>
              </ul>
            </div>
            <p>
              To accept this offer, please click the button below to sign the document electronically.
            </p>
            <a href="${signatureLink}" class="btn">Sign Offer Letter</a>
          </div>
          <div class="footer">
            <p>&copy; 2025 Your Company Name. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    // Launch Puppeteer to generate the PDF from HTML
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    await page.pdf({ path: pdfPath, format: "A4" });
    await browser.close();

    // Set up Nodemailer with Gmail to send the email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    // Optional frontend signature link

    // Send email with the PDF attached
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Your Offer Letter - Signature Required",
      text: `Dear ${userName},

Please find attached your offer letter. You may also review and sign your offer online here: ${signatureLink}

Best regards,
P&P INFOTECH`,
      attachments: [
        {
          filename: "OfferLetter.pdf",
          path: pdfPath
        }
      ]
    });

    res.status(200).json({ message: "Offer Letter Sent with PDF!", offer });
  } catch (error) {
    console.error("Error generating offer letter:", error);
    res.status(500).json({ message: "Error generating offer letter" });
  }
};


exports.trackEmail = async (req, res) => {

  const { offerId } = req.params;
  const userAgent = req.headers["user-agent"] || "";

  console.log("TrackEmail opened for Offer ID:", offerId);
  console.log("User-Agent:", userAgent);

  try {

    const offer = await OfferModel.findOne({ _id: offerId });
    if (!offer) {
      return res.status(404).send("Invalid request");
    }

    const headlessUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/134.0.0.0 Safari/537.36";

    if (!offer.isViewed) {
      if (userAgent.trim() !== headlessUA) {
        await OfferModel.findByIdAndUpdate(offerId, { isViewed: true, viewedAt: new Date() });
        console.log("Offer marked as viewed");
      } else {
        console.log("HeadlessChrome request detected; not marking as viewed");
      }
    } else {
      console.log("Offer already marked as viewed");
    }

    const pixel = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP88xIAAN8A3cX/6TcAAAAASUVORK5CYII=",
      "base64"
    );
    res.set("Content-Type", "image/png");
    res.send(pixel);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error tracking email");
  }
};

// expots.signOffer = async (req, res) => {
//     try {
//         const { email, signature } = req.body;
//         const offer = await OfferModel.findOne({ userEmail: email });
//         if(!offer){
//             return res.status(404).json({message:"Offer Letter Not Found!"})
//         }

//     } catch (error) {
//         console.error("Error signing offer:", error);
//         res.status(500).json({ message: "Error signing offer" });
//     }
// }


exports.signOffer = async (req, res) => {
  try {
    const { email, signature } = req.body;
    // Find the offer by user email
    const offer = await OfferModel.findOne({ userEmail: email });
    if (!offer) {
      return res.status(404).json({ message: "Offer Letter Not Found!" });
    }

    // Optionally, update the offer record with the signature (if needed)
    offer.signature = signature;
    offer.signedAt = new Date();
    await offer.save();

    // Define a folder and file path for the updated PDF
    const offerFolder = path.join(__dirname, "../offers");
    if (!fs.existsSync(offerFolder)) {
      fs.mkdirSync(offerFolder, { recursive: true });
    }
    const updatedPdfPath = path.join(offerFolder, `${email}_signed_offer.pdf`);

    // Create updated HTML content for the PDF that includes the signature image
    // You can adjust the HTML as needed (logo, content, policy points, etc.)
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .header img { width: 150px; }
            .content { margin: 20px; }
            .content h1 { color: #333; }
            .content p { font-size: 16px; color: #555; line-height: 1.5; }
            .policy { margin-top: 20px; }
            .policy h3 { color: #007bff; }
            .policy ul { list-style-type: disc; padding-left: 20px; }
            .signature { margin-top: 30px; text-align: center; }
            .signature img { width: 200px; border: 1px solid #ccc; }
            .footer { margin-top: 40px; font-size: 12px; color: #777; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT99XVSieJwmWcAjaxxFhdHPoCi-Jof0u4eWA&s" alt="Company Logo">
          </div>
          <div class="content">
            <h1>Offer Letter for ${offer.userName}</h1>
            <p>Dear ${offer.userName},</p>
            <p>
              We are delighted to offer you the position of <strong>${offer.position}</strong> with an annual salary of <strong>${offer.salary}</strong>.
              Below are the detailed terms and policies governing your employment:
            </p>
            <h2>Offer Details</h2>
            <p>
              Your role is integral to our team and involves responsibilities that align with our mission of innovation and excellence.
              You are expected to adhere to the highest standards of professionalism and ethical behavior.
            </p>
            <div class="policy">
              <h3>Key Policy Points:</h3>
              <ul>
                <li><strong>Confidentiality:</strong> All proprietary information must remain confidential.</li>
                <li><strong>Non-Disclosure:</strong> You are required to sign a non-disclosure agreement regarding company secrets.</li>
                <li><strong>Code of Conduct:</strong> Maintain professionalism and respect in all interactions.</li>
                <li><strong>Performance Reviews:</strong> Regular evaluations will help monitor and foster your growth.</li>
                <li><strong>Compliance:</strong> Adhere to all company policies, legal regulations, and industry standards.</li>
              </ul>
            </div>
            <div class="signature">
              <h3>Your Signature:</h3>
              <img src="${signature}" alt="Signature Image">
            </div>
            <p>
              You have successfully signed the offer letter. We will proceed with further steps shortly.
            </p>
          </div>
          <div class="footer">
            <p>&copy; 2025 P&P INFOTECH. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    // Use Puppeteer to generate the updated PDF from HTML
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    await page.pdf({ path: updatedPdfPath, format: "A4" });
    await browser.close();

    // Configure Nodemailer to send the updated PDF via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    // Prepare email text/message
    const emailText = `
      Dear ${offer.userName},
      
      You have successfully signed and accepted your offer letter. Please find the updated offer letter (with your signature) attached.
      
      We will proceed with further steps shortly.
      
      Best regards,
      P&P INFOTECH
    `;

    // Send email with the updated PDF attached
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Offer Letter Signed Successfully - Next Steps",
      text: emailText,
      attachments: [
        {
          filename: "SignedOfferLetter.pdf",
          path: updatedPdfPath
        }
      ]
    });

    res.status(200).json({ message: "Offer signed and updated PDF sent successfully!", offer });
  } catch (error) {
    console.error("Error signing offer:", error);
    res.status(500).json({ message: "Error signing offer" });
  }
};