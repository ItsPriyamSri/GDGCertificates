import { motion } from "framer-motion";

function ViewCertificate() {
  let data = null;
  try {
    data = JSON.parse(localStorage.getItem("data"));
  } catch (e) {
    console.error("Invalid data in localStorage:", e);
    localStorage.removeItem("data");
  }

  if (!data) {
    window.location.href = "/certificate";
    return null;
  }
  console.log(data);

  const url = window.location.href.split("/")[2];

  // Device detection function - ONLY uses user agent, not screen width
  // to avoid false positives on desktop with narrow windows or DevTools open
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Desktop print function (original working implementation)
  const printCertificateDesktop = () => {
    // Get all stylesheets from current page
    const stylesheets = Array.from(document.styleSheets)
      .map(sheet => {
        try {
          return Array.from(sheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n');
        } catch (e) {
          return '';
        }
      })
      .join('\n');

    // Additional print-specific styles
    const printStyles = `
      <style>
        ${stylesheets}
        
        @page { 
          size: A4; 
          margin: 0mm !important;  
        }
        
        @media print {
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: url('/bg.png') !important;
            background-size: cover !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .container {
            min-height: 100vh !important;
            height: auto !important;
            padding: 15px !important;
            page-break-inside: avoid !important;
            border: 25px solid #ffbd23ff !important; 
          }

          .logo {
            padding: 5px 10px !important;
          }

          .logo-gdg { height: 25px !important; }
          .logo-srmcem { height: 40px !important; }

          .certificate {
            padding: 5px 20px !important;
            margin-bottom: 5px !important;
          }

          .certificate > h1 {
            font-size: 28px !important;
            margin: 3px 0 !important;
          }

          .certificate > h2 {
            font-size: 20px !important;
            margin: 3px 0 !important;
          }

          .certificate > p {
            font-size: 13px !important;
            margin: 5px 0 !important; 
            line-height: 1.3 !important;
          }

          .signatures {
            margin: 5px 0 !important;
            padding: 0 20px !important;
          }

          .signatures > div {
            font-size: 12px !important;
          }

          .signatures img {
            height: 30px !important;
          }

          .badges {
            gap: 12px !important;
            padding: 0px 15px !important;
            justify-content: center !important;
            flex-wrap: wrap !important;
            margin-top: -15px !important;
          }

          .badge {
            width: 130px !important;
            height: 110px !important;
            flex-shrink: 0 !important;
            page-break-inside: avoid !important;
          }

          .print-page {
            page-break-after: avoid !important;
          }

          .page-2 {
            display: none !important;
          }
        }
      </style>
    `;

    let mywindow = window.open("", "PRINT", "height=1080,width=1920");
    mywindow.document.write("<html><head><title>GDG SRMCEM Certificate</title>");
    mywindow.document.write(printStyles);
    mywindow.document.write("</head><body>");
    mywindow.document.write(document.querySelector(".pbody").innerHTML);
    mywindow.document.write("</body></html>");

    mywindow.document.close();
    mywindow.focus();

    setTimeout(() => {
      mywindow.print();
    }, 250);
  };

  // Mobile-optimized print function
  const printCertificateMobile = () => {
    // Mobile-specific styles with fixed mm dimensions and no @media print wrappers
    const mobileStyles = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');
        
        @font-face {
          font-family: 'Google Sans Reg';
          src: url('/GoogleSansDisplay-Regular.ttf');
        }
        
        @font-face {
          font-family: 'Google Sans Bold';
          src: url('/GoogleSansDisplay-Bold.ttf');
        }

        @page { 
          size: 210mm 297mm; 
          margin: 0 !important;
        }

        * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }

        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 210mm !important;
          height: 297mm !important;
          overflow: hidden !important;
          background: url('/bg.png') !important;
          background-size: cover !important;
          background-repeat: no-repeat !important;
          background-position: center !important;
        }

        .container {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 210mm !important;
          height: 297mm !important;
          padding: 10px !important;
          background-color: aliceblue !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: space-around !important;
          overflow: hidden !important;
          border: 20px solid #ffbd23ff !important;
          page-break-inside: avoid !important;
          page-break-after: avoid !important;
        }

        .logo {
          display: flex !important;
          flex-direction: row !important;
          justify-content: space-between !important;
          align-items: center !important;
          padding: 5px 10px !important;
          flex-shrink: 0 !important;
        }

        .logo-gdg { 
          height: 22px !important; 
          max-width: 100% !important;
          object-fit: contain !important;
        }
        .logo-srmcem { 
          height: 35px !important; 
          max-width: 100% !important;
          object-fit: contain !important;
        }

        .certificate {
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: center !important;
          font-family: 'Google Sans Bold', sans-serif !important;
          padding: 5px 15px !important;
          flex-shrink: 0 !important;
        }

        .certificate > h1 {
          font-size: 24px !important;
          color: #ea4335 !important;
          text-decoration-line: underline !important;
          text-decoration-color: #f5bf4a !important;
          margin: 2px 0 !important;
        }

        #sp1 { color: #34a853 !important; }
        #sp2 { color: #4285f4 !important; }

        .certificate > h2 {
          font-size: 18px !important;
          font-weight: 400 !important;
          margin: 2px 0 5px 0 !important;
        }

        .certificate > p {
          font-size: 11px !important;
          font-family: 'Open Sans', sans-serif !important;
          margin: 3px 0 !important;
          line-height: 1.2 !important;
          text-align: center !important;
        }

        .signatures {
          display: flex !important;
          flex-direction: row !important;
          justify-content: space-between !important;
          align-items: center !important;
          text-align: center !important;
          width: 100% !important;
          font-family: 'Google Sans Reg', sans-serif !important;
          font-size: 10px !important;
          padding: 0 15px !important;
          margin: 3px 0 !important;
          flex-shrink: 0 !important;
        }

        .signatures > div {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          height: 35px !important;
        }

        .signatures img {
          height: 25px !important;
          max-width: 100% !important;
          object-fit: contain !important;
        }

        #sign-hod::after {
          content: '';
          background: black;
          width: 100%;
          height: 2px;
        }

        #sign-gdg::after {
          content: '';
          width: 100%;
          height: 2px;
        }

        .badges {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: wrap !important;
          justify-content: center !important;
          gap: 5px !important;
          padding: 3px 8px !important;
          width: 100% !important;
          flex-shrink: 1 !important;
        }

        .badge {
          width: 55px !important;
          height: 55px !important;
          padding: 3px !important;
          border-radius: 50% !important;
          position: relative !important;
          overflow: hidden !important;
          background: white !important;
          box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2) !important;
          flex-shrink: 0 !important;
          page-break-inside: avoid !important;
        }

        .badge > .badge-bg {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          position: absolute !important;
        }

        .badge > .badge-img {
          width: 90% !important;
          max-height: 90% !important;
          position: relative !important;
          top: 52% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          object-fit: contain !important;
        }

        .print-page {
          page-break-after: avoid !important;
          page-break-inside: avoid !important;
        }
      </style>
    `;

    // Open window with A4 pixel dimensions
    let mywindow = window.open("", "PRINT", "width=794,height=1123");
    mywindow.document.write("<!DOCTYPE html>");
    mywindow.document.write("<html><head>");
    mywindow.document.write('<meta charset="UTF-8">');
    mywindow.document.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    mywindow.document.write("<title>GDG SRMCEM Certificate</title>");
    mywindow.document.write(mobileStyles);
    mywindow.document.write("</head><body>");
    mywindow.document.write(document.querySelector(".pbody").innerHTML);
    mywindow.document.write("</body></html>");

    mywindow.document.close();
    mywindow.focus();

    // Longer timeout for mobile to ensure images load
    setTimeout(() => {
      mywindow.print();
    }, 800);
  };

  // Main print function - calls appropriate handler based on device
  const printCertificate = () => {
    if (isMobile()) {
      printCertificateMobile();
    } else {
      printCertificateDesktop();
    }
  };

  return (
    <>
      <div className="printbar">
        <div>
          <h1>Click this button to print your certificate</h1>
          <p>
            <b>NOTE:</b>
            set the page size as A4, and margin as none if it isn't in 1 page
          </p>
        </div>
        <button
          onClick={() => {
            printCertificate();
          }}
        >
          Print
        </button>
      </div>
      <motion.main
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 50 }}
      >
        <div className="container">
          <div className="logo">
            <img className="logo-gdg" src="/logo-gdg.png" alt="" />
            <img className="logo-srmcem" src="/logo-srmcem.png" alt="" />
          </div>

          <div className="certificate">
            <h1>
              Certificate <span id="sp1">of</span>{" "}
              <span id="sp2">Achievement</span>
            </h1>
            <h2>{data.name}</h2>
            <p>
              Awarded for successfully completing the Google Cloud Study Jams 2025 program,
              demonstrating exceptional dedication to mastering Generative AI and Google Cloud
              technologies through hands-on learning and practical skill development.
            </p>
          </div>
          <div className="signatures">
            <div id="sign-gdg">
              <img src="/organizer-sign.png" />
              GDG on Campus Organiser
            </div>

            <div id="sign-hod">
              <img src="/gdg-hod.png" />
              Head of Department CSE
            </div>
          </div>

          <div className="badges">
            {data.badges.map((badge, index) => {
              if (index === 0) {
                return (
                  <a key={index} className="badge" href={badge.link}>
                    <img
                      className="badge-img"
                      src={badge.img_url}
                      alt="badge"
                    />
                  </a>
                );
              }

              console.log(badge.img_url);
              return (
                <a key={index} className="badge" href={badge.link}>
                  <img className="badge-img" src={badge.img_url} alt="badge" />
                  <img className="badge-bg" src="/badge-bg.png" alt="badge" />
                </a>
              );
            })}
          </div>
        </div>
      </motion.main>
      <PrintCertificate data={data} />
    </>
  );
}

function PrintCertificate({ data }) {
  return (
    <div className="pbody">
      <div className="container print-page">
        <div className="logo">
          <img className="logo-gdg" src="/logo-gdg.png" alt="" />
          <img className="logo-srmcem" src="/logo-srmcem.png" alt="" />
        </div>

        <div className="certificate">
          <h1>
            Certificate <span id="sp1">of</span>{" "}
            <span id="sp2">Achievement</span>
          </h1>
          <h2>{data.name}</h2>
          <p>
            Awarded for successfully completing the Google Cloud Study Jams 2025 program,
            demonstrating exceptional dedication to mastering Generative AI and Google Cloud
            technologies through hands-on learning and practical skill development.
          </p>
        </div>

        <div className="signatures">
          <div id="sign-gdg">
            <img src="/organizer-sign.png" alt="" />
            GDG on Campus Organiser
          </div>

          <div id="sign-hod">
            <img src="/gdg-hod.png" alt="" />
            Head of Department CSE
          </div>
        </div>

        <div className="badges">
          {data.badges.map((badge, index) => {
            if (index === 0) {
              return (
                <a key={index} className="badge" href={badge.link}>
                  <img className="badge-img" src={badge.img_url} alt="badge" />
                </a>
              );
            }
            return (
              <a key={index} className="badge" href={badge.link}>
                <img className="badge-img" src={badge.img_url} alt="badge" />
                <img className="badge-bg" src="/badge-bg.png" alt="badge" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ViewCertificate;
