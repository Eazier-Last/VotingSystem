import React, { useState, useEffect } from "react";
import "../App.css";
import Button from "@mui/material/Button";
import NewCandidate from "./Modals/NewCandidate";
import { supabase } from "./client";

function Three() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [candidates, setCandidates] = useState([]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCandidateSubmit = async (candidate) => {
    const { data, error } = await supabase
      .from("candidates")
      .insert([candidate]);
    if (error) {
      console.error("Error saving candidate:", error);
      return;
    }

    setCandidates((prev) => [...prev, data[0]]);
    toggleModal();
  };

  useEffect(() => {
    const fetchCandidates = async () => {
      const { data, error } = await supabase.from("candidates").select("*");
      if (error) {
        console.error("Error fetching candidates:", error);
        return;
      }
      setCandidates(data);
    };

    fetchCandidates();
  }, []);

  const groupedCandidates = candidates.reduce((acc, candidate) => {
    acc[candidate.position] = acc[candidate.position] || [];
    acc[candidate.position].push(candidate);
    return acc;
  }, {});

  return (
    <div className="homeRow">
      <div className="navSpace"></div>
      <div className="homeContainer">
        <div className="listContainer topLabel">
          MANAGE CANDIDATES <br />
          <Button
            sx={{ color: "#1ab394", borderColor: "#1ab394", marginTop: "10px" }}
            onClick={toggleModal}
            variant="outlined"
          >
            + New Candidate
          </Button>
        </div>

        <div className="listContainer">
          <div>
            <h2 className="topLabel">CANDIDATES</h2>
          </div>
          {Object.keys(groupedCandidates).map((position) => (
            <div key={position}>
              <h3 className="position">
                {position
                  .replace(/([A-Z])/g, " $1")
                  .trim()
                  .toUpperCase()}
              </h3>
              <div className="profileContainer">
                {groupedCandidates[position].map((candidate, index) => (
                  <div key={index}>
                    <div className="profileRow">
                      <img
                        className="imgSize"
                        alt={candidate.name}
                        src={candidate.file}
                      />
                    </div>
                    <div className="candidateName">
                      <p>{candidate.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {}
        {isModalOpen && (
          <NewCandidate
            onSubmit={handleCandidateSubmit}
            toggleModal={toggleModal}
          />
        )}
      </div>
    </div>
  );
}

export default Three;
