import { motion } from "framer-motion";

function ViewCertificate() {
  var data = JSON.parse(localStorage.getItem("data"));

  // data ? {} : (window.location.href = '/certificate');
  if (!data) {
    window.location.href = "/certificate";
  }
  console.log(data);

  const url = window.location.href.split("/")[2];

  const printCertificate = () => {
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
          background: url('/bg.png') !important;  /* ⭐ Background add */
          background-size: cover !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

         .container {
          min-height: 100vh !important;
          height: auto !important;
          padding: 15px !important;  /* ⭐ Reduced */
          page-break-inside: avoid !important;
          border: 25px solid #ffbd23ff !important; 
        }

        .logo {
          padding: 5px 10px !important;
        }

        .logo-gdg { height: 25px !important; }
        .logo-srmcem { height: 40px !important; }

        .certificate {
         padding: 5px 20px !important;  /* ⭐ Vertical padding reduce */
         margin-bottom: 5px !important;  /* ⭐ Space kam kiya */
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
          gap: 12px !important;  /* ⭐ Reduced gap */
          padding: 0px 15px !important;  /* ⭐ Optimized */
          justify-content: center !important;
          flex-wrap: wrap !important;
          margin-top: -15px !important;
        }

        .badge {
          width: 130px !important;  /* ⭐ Slightly bigger */
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
              For active participation in the GenAI Study Jam and commitment to
              learning about Generative AI and Google Cloud. This achievement
              highlights dedication to advancing knowledge in innovative
              technologies.
            </p>
          </div>
          <div className="signatures">
            <div id="sign-gdg">
              <img src="/priyam-removebg-preview.png" />
              GDG on Campus Organiser
            </div>

            <div id="sign-hod">
              <img src="/gdg-hod.png" />
              Head of Department CSE & AI/ML SRMCEM
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
            For active participation in the GenAI Study Jam and commitment to
            learning about Generative AI and Google Cloud. This achievement
            highlights dedication to advancing knowledge in innovative
            technologies.
          </p>
        </div>

        <div className="signatures">
          <div id="sign-gdg">
            <img src="/priyam-removebg-preview.png" alt="" />
            GDG on Campus Organiser
          </div>

          <div id="sign-hod">
            <img src="/gdg-hod.png" alt="" />
            Head of Department CSE & AI/ML SRMCEM
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
