import React, { useState, useEffect } from "react";
import "./Modals.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { supabase } from "../client";

function NewCandidate({ toggleModal, onSubmit, candidate }) {
  const [file, setFile] = useState();
  const [position, setPosition] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");
  const [campaignObjective, setCampaignObjective] = useState("");
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    if (candidate) {
      setCandidateName(candidate.name);
      setSkills(candidate.skills);
      setDescription(candidate.description);
      setCampaignObjective(candidate.campaignObjective);
      setPosition(candidate.position);
      setFile(candidate.file);
    }
  }, [candidate]);

  const fetchPositions = async () => {
    const { data, error } = await supabase.from("positions").select("*");
    if (error) {
      console.error("Error fetching positions:", error);
      return;
    }
    setPositions(data.map((pos) => pos.positions)); // Map Supabase data to state
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleChange = (event) => {
    setPosition(event.target.value);
  };

  function handleImage(e) {
    if (e.target.files && e.target.files[0]) {
      setFile(URL.createObjectURL(e.target.files[0]));
    } else {
      setFile(null);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !candidateName ||
      !skills ||
      !description ||
      !campaignObjective ||
      !file ||
      !position
    ) {
      alert("Please fill all fields!");
      return;
    }

    const candidateData = {
      name: candidateName,
      skills,
      description,
      campaignObjective,
      position,
      file,
    };

    onSubmit(candidateData);

    setCandidateName("");
    setSkills("");
    setDescription("");
    setCampaignObjective("");
    setFile(null);
    setPosition("");
    toggleModal();
  };

  return (
    <div className="modal">
      <div className="modalOverlay" onClick={toggleModal}></div>
      <div className="modalContent">
        <div className="closeBtn">
          <Button className="closeIcon" variant="text" onClick={toggleModal}>
            <CloseIcon />
          </Button>
        </div>
        <div>
          <h2 className="topLabel">NEW CANDIDATE</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <FormControl sx={{ m: 1, minWidth: 450 }} size="small">
              <InputLabel id="demo-select-small-label">Position</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={position}
                label="Position"
                onChange={handleChange}
                required
              >
                {positions.map((pos, index) => (
                  <MenuItem key={index} value={pos}>
                    {pos}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <Box
              component="form"
              sx={{ "& .MuiTextField-root": { m: 1, width: "50ch" } }}
              noValidate
              autoComplete="off"
            >
              <div>
                <TextField
                  label="Candidate Name"
                  id="outlined-size-small"
                  size="small"
                  required
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                />
              </div>
            </Box>
          </div>
          <div>
            <Box
              component="form"
              sx={{ "& .MuiTextField-root": { m: 1, width: "50ch" } }}
              noValidate
              autoComplete="off"
            >
              <div>
                <TextField
                  label="Skills"
                  id="outlined-size-small"
                  size="small"
                  required
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>
            </Box>
          </div>
          <div>
            <Box
              component="form"
              sx={{ "& .MuiTextField-root": { m: 1, width: "50ch" } }}
              noValidate
              autoComplete="off"
            >
              <div>
                <TextField
                  id="outlined-multiline-static"
                  label="Description"
                  multiline
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </Box>
          </div>
          <div>
            <Box
              component="form"
              sx={{ "& .MuiTextField-root": { m: 1, width: "50ch" } }}
              noValidate
              autoComplete="off"
            >
              <div>
                <TextField
                  id="outlined-multiline-static"
                  label="Campaign Objective"
                  multiline
                  rows={3}
                  required
                  value={campaignObjective}
                  onChange={(e) => setCampaignObjective(e.target.value)}
                />
              </div>
            </Box>
          </div>
          <div>
            <label className="uploadIcon" htmlFor="imageUpload">
              <AddPhotoAlternateIcon sx={{ fontSize: 100 }} />
            </label>
            <br />
            <span>Upload Image</span>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImage}
              required
            />
          </div>
          <div className="preview">
            {file && <img className="imgSize" src={file} alt="candidate" />}
          </div>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#1ab394",
              marginTop: "10px",
            }}
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}

export default NewCandidate;
