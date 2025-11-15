import { useEffect, useState } from "react";
import CertificateDetails from "./CertificateDetails";
import ViewCertificate from "./ViewCertificate";
import { Routes, Route } from "react-router-dom";

function Certificate() {
  const [ProfileURL, setProfileURL] = useState();
  // https://www.cloudskillsboost.google/public_profiles/b3487dc3-9b6f-4b3a-90bc-8bd65c3a8aea

  const server = window.location.href
    .split("/")[2]
    .split(":")[0]
    .replace("3000", "8080");

  useEffect(() => {
    ProfileURL
      ? fetchData(ProfileURL).then((data) => {
          console.log(data);
          handleDataFetch(data);
          // data ? handleDataFetch(data) : (window.location.href = "/error");
          // window.location.href = "/error";
        })
      : console.log("waiting for user input");
  }, [ProfileURL]);

  const fetchData = async (url) => {
    console.log("fetching data started");

    try {
      const response = await fetch("https://gdg-certificates-proxy.onrender.com" + url, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("You might have entered an invalid or wrong URL");
      }
      const data = await response.text();
      const parser = new DOMParser();
      const page = parser.parseFromString(data, "text/html");
      const badges = page.querySelectorAll(".profile-badge");
      const finalBadges = [];
      badges.forEach((badge) => {
        const b = {
          link: badge.children[0].href,
          img_url: badge.children[0].children[0].src,
          b_name: badge.children[1].innerText,
        };
        finalBadges.push(b);
        console.log(b);
      });
      console.log(finalBadges);
      const name = data.split("<title>")[1].split("|")[0];
      const obj = {
        name: name,
        badges: finalBadges,
      };
      // console.log(obj);

      return obj;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  const handleDataFetch = (data) => {
    console.log("fetched data");
    console.log(JSON.stringify(data));
    localStorage.setItem("data", JSON.stringify(data));
    window.location.href = "/certificate/view";
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<CertificateDetails setProfileURL={setProfileURL} />}
        />
        <Route path="/view" element={<ViewCertificate />} />
      </Routes>
    </>
  );
}

export default Certificate;

// (window.location.href = '/error')
