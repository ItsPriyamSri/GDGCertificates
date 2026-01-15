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

      // Cutoff date: November 1, 2025
      const cutoffDate = new Date('2025-11-01');

      // Helper function to parse earned date from badge text
      const parseEarnedDate = (badge) => {
        // Look for date in the badge text content
        // Format is typically "Earned Nov 15, 2024 EST" or similar
        const text = badge.textContent || badge.innerText || '';
        const dateMatch = text.match(/Earned\s+(\w+\s+\d{1,2},?\s+\d{4})/i);

        if (dateMatch) {
          try {
            const dateStr = dateMatch[1].replace(',', '');
            const parsed = new Date(dateStr);
            if (!isNaN(parsed.getTime())) {
              return parsed;
            }
          } catch (e) {
            console.log('Could not parse date:', dateMatch[1]);
          }
        }
        return null;
      };

      // Helper to check if badge is the specific Level 3: Generative AI badge we want
      const isGenAILevel3Badge = (badgeName) => {
        const name = (badgeName || '').toLowerCase().trim();
        return name.includes('level 3') && name.includes('generative ai');
      };

      // Helper to check if badge is an unwanted arcade badge (trivia, other levels, etc.)
      const isUnwantedArcadeBadge = (badgeName) => {
        const name = (badgeName || '').toLowerCase().trim();
        // Exclude trivia badges, other arcade levels, etc. - but NOT Level 3: Generative AI
        if (isGenAILevel3Badge(badgeName)) {
          return false; // Keep this one
        }
        return (
          name.includes('trivia') ||
          name.includes('arcade') ||
          (name.startsWith('level') && !name.includes('generative ai'))
        );
      };

      badges.forEach((badge) => {
        const earnedDate = parseEarnedDate(badge);
        const badgeName = badge.children[1]?.innerText || '';

        // Only include badges earned before Nov 1, 2025 (or if date couldn't be parsed)
        // If date parsing fails, we include the badge to be safe
        if (earnedDate && earnedDate > cutoffDate) {
          console.log('Filtering out badge earned after cutoff:', badgeName, earnedDate);
          return; // Skip this badge
        }

        // Exclude unwanted arcade badges (trivia, other levels, etc.)
        if (isUnwantedArcadeBadge(badgeName)) {
          console.log('Filtering out unwanted arcade badge:', badgeName);
          return; // Skip this badge
        }

        const b = {
          link: badge.children[0].href,
          img_url: badge.children[0].children[0].src,
          b_name: badgeName,
          earned_date: earnedDate ? earnedDate.toISOString() : null,
        };

        finalBadges.push(b);
        console.log(b);
      });

      console.log(`Found ${finalBadges.length} badges before Nov 1, 2025`);

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

      // Limit to maximum 20 badges for the certificate
      const limitedBadges = sortedBadges.slice(0, 20);
      console.log(`Displaying ${limitedBadges.length} badges (max 20)`);

      const name = data.split("<title>")[1].split("|")[0];
      const obj = {
        name: name,
        badges: limitedBadges,
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
