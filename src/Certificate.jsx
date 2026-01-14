import { useEffect, useState } from "react";
import CertificateDetails from "./CertificateDetails";
import ViewCertificate from "./ViewCertificate";
import { Routes, Route } from "react-router-dom";

function Certificate() {
  const [ProfileURL, setProfileURL] = useState();
  const [isLoading, setIsLoading] = useState(false);
  // https://www.cloudskillsboost.google/public_profiles/b3487dc3-9b6f-4b3a-90bc-8bd65c3a8aea

  const server = window.location.href
    .split("/")[2]
    .split(":")[0]
    .replace("3000", "8080");

  useEffect(() => {
    if (ProfileURL) {
      setIsLoading(true);
      fetchData(ProfileURL).then((data) => {
        console.log(data);
        if (data) {
          handleDataFetch(data);
        } else {
          setIsLoading(false);
          alert("Failed to fetch data. Please check the URL and try again.");
        }
      });
    } else {
      console.log("waiting for user input");
    }
  }, [ProfileURL]);

  const fetchData = async (url) => {
    console.log("fetching data started");

    try {
      const response = await fetch("https://gdg-certificates-proxy.onrender.com/" + url, {
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

      // Sort badges to put arcade badge first (it displays without frame)
      // Arcade level badges have names like "Level 3: Generative AI"
      const isArcadeBadge = (badge) => {
        const name = (badge.b_name || '').toLowerCase().trim();
        const url = (badge.img_url || '').toLowerCase();

        // Explicit checks for arcade/level badges
        return (
          name.includes('level 3') ||           // "Level 3: Generative AI"
          name.includes('level 2') ||           // "Level 2: ..."
          name.includes('level 1') ||           // "Level 1: ..."
          name.startsWith('level') ||           // Any "Level X: ..." format
          name.includes('arcade') ||            // Contains "arcade"
          url.includes('arcade')                // URL contains "arcade"
        );
      };

      const arcadeBadgeIndex = finalBadges.findIndex(isArcadeBadge);
      let sortedBadges = finalBadges;

      if (arcadeBadgeIndex !== -1) {
        // Remove arcade badge from its current position and put it first
        const arcadeBadge = finalBadges[arcadeBadgeIndex];
        sortedBadges = [
          arcadeBadge,
          ...finalBadges.slice(0, arcadeBadgeIndex),
          ...finalBadges.slice(arcadeBadgeIndex + 1)
        ];
        console.log('Arcade badge found at index:', arcadeBadgeIndex);
        console.log('Arcade badge:', arcadeBadge);
      } else {
        console.log('No arcade badge found. Badge names:', finalBadges.map(b => b.b_name));
      }

      console.log('Sorted badges:', sortedBadges);

      const name = data.split("<title>")[1].split("|")[0];
      const obj = {
        name: name,
        badges: sortedBadges,
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
          element={<CertificateDetails setProfileURL={setProfileURL} isLoading={isLoading} />}
        />
        <Route path="/view" element={<ViewCertificate />} />
      </Routes>
    </>
  );
}

export default Certificate;

// (window.location.href = '/error')
