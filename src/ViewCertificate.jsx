import { useState, useEffect } from "react";
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

  // Print button delay state - wait for CSS to fully load
  const [isPrintReady, setIsPrintReady] = useState(false);

  useEffect(() => {
    // Wait 2.5 seconds for CSS and images to load before enabling print
    const timer = setTimeout(() => {
      setIsPrintReady(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

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
            margin: 4px 0 !important; 
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
            height: 130px !important;
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

  // Mobile-optimized print function - mirrors desktop approach with single-page lock
  const printCertificateMobile = () => {
    // Get all stylesheets from current page (same as desktop)
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

    // Mobile print styles - same as desktop but with single-page enforcement
    const mobileStyles = `
      <style>
        ${stylesheets}
        
        @page { 
          size: A4; 
          margin: 0 !important;  
        }
        
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        html {
          height: 100% !important;
          max-height: 100vh !important;
          overflow: hidden !important;
        }
        
        body {
          margin: 0 !important;
          padding: 0 !important;
          height: 100% !important;
          max-height: 100vh !important;
          overflow: hidden !important;
          background: url('/bg.png') !important;
          background-size: cover !important;
        }

        .container {
          width: 100% !important;
          height: auto !important;
          min-height: 100vh !important;
          max-height: 100vh !important;
          padding: 10px !important;
          border: 20px solid #ffbd23ff !important;
          
          /* Single page enforcement */
          page-break-inside: avoid !important;
          page-break-before: avoid !important;
          page-break-after: avoid !important;
          break-inside: avoid !important;
          
          display: flex !important;
          flex-direction: column !important;
          justify-content: flex-start !important;
          gap: 8px !important;
          overflow: hidden !important;
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
          display: flex !important;
          flex-wrap: wrap !important;
          justify-content: center !important;
          align-content: center !important;
          gap: 6px !important;
          padding: 5px 10px !important;
          width: 100% !important;
          flex-grow: 1 !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        .badge {
          /* Circular badges with fixed dimensions */
          width: 70px !important;
          height: 70px !important;
          flex-shrink: 0 !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        .print-page {
          page-break-after: avoid !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        .page-2 {
          display: none !important;
        }
      </style>
    `;

    let mywindow = window.open("", "PRINT", "height=1080,width=1920");
    mywindow.document.write("<html><head><title>GDG SRMCEM Certificate</title>");
    mywindow.document.write(mobileStyles);
    mywindow.document.write("</head><body>");
    mywindow.document.write(document.querySelector(".pbody").innerHTML);
    mywindow.document.write("</body></html>");

    mywindow.document.close();
    mywindow.focus();

    setTimeout(() => {
      mywindow.print();
    }, 500);
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
          disabled={!isPrintReady}
          style={{
            opacity: isPrintReady ? 1 : 0.6,
            cursor: isPrintReady ? 'pointer' : 'not-allowed'
          }}
        >
          {isPrintReady ? 'Print' : 'Preparing...'}
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
