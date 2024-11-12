import React, { useState, useEffect } from "react";
import "../App.css";
import "./css/Users.css";
import Button from "@mui/material/Button";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import NewUser from "./Modals/NewUser";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { supabase } from "./client";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1ab394",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function Four() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("BSIT");
  const [users, setUsers] = useState({
    BSIT: [],
    BSCS: [],
    BSCA: [],
    BSBA: [],
    BSHM: [],
    BSTM: [],
    BSE: [],
    BSED: [],
    BSPSY: [],
    BSCrim: [],
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("users").select("*");
    if (error) {
      console.error("Error fetching users:", error);
      return;
    }

    console.log(data);

    const organizedUsers = {
      BSIT: [],
      BSCS: [],
      BSCA: [],
      BSBA: [],
      BSHM: [],
      BSTM: [],
      BSE: [],
      BSED: [],
      BSPSY: [],
      BSCrim: [],
    };

    data.forEach((user) => {
      organizedUsers[user.course]?.push(user);
    });

    setUsers(organizedUsers);
  };

  const handleOpenModal = (user = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleAddUser = async (newUser) => {
    if (selectedUser) {
      await handleEditUser(selectedUser.id, newUser);
    } else {
      await handleCreateUser(newUser);
    }
    setIsModalOpen(false);
  };

  const handleCreateUser = async (newUser) => {
    const { error } = await supabase.from("users").insert([newUser]);
    if (error) {
      console.error("Error adding user:", error.message);
      alert("Failed to add user: " + error.message);
      return;
    }

    setUsers((prevUsers) => ({
      ...prevUsers,
      [newUser.course]: [...prevUsers[newUser.course], newUser],
    }));
  };

  const handleEditUser = async (userId, updatedUser) => {
    const { error } = await supabase
      .from("users")
      .update(updatedUser)
      .match({ id: userId });

    if (error) {
      console.error("Error updating user:", error.message);
      alert("Failed to update user: " + error.message);
      return;
    }

    setUsers((prevUsers) => {
      const updatedUsers = { ...prevUsers };
      updatedUsers[updatedUser.course] = updatedUsers[updatedUser.course].map(
        (user) => (user.id === userId ? updatedUser : user)
      );
      return updatedUsers;
    });
    setSelectedUser(null);
  };

  const handleDeleteUser = async (course, index) => {
    const userToDelete = users[course][index];

    const { error } = await supabase
      .from("users")
      .delete()
      .match({ id: userToDelete.id });

    if (error) {
      console.error("Error deleting user:", error.message);
      alert("Failed to delete user: " + error.message);
    }

    const updatedUsers = users[course].filter((_, i) => i !== index);
    setUsers((prevUsers) => ({
      ...prevUsers,
      [course]: updatedUsers,
    }));
  };

  return (
    <div className="homeRow">
      <div className="navSpace"></div>
      <div className="homeContainer">
        <div className="listContainer topLabel">
          USERS <br />
          <Button
            sx={{ color: "#1ab394", borderColor: "#1ab394", marginTop: "10px" }}
            onClick={() => handleOpenModal()}
            variant="outlined"
          >
            + New User
          </Button>
        </div>
        <div className="listContainer userContainer">
          <div className="userSectionRow1">
            <List
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader
                  sx={{ fontSize: "1.2rem", color: "#1ab394" }}
                  component="div"
                  id="nested-list-subheader"
                  className="topLabel"
                >
                  Courses
                </ListSubheader>
              }
            >
              {Object.keys(users).map((course) => (
                <ListItemButton
                  className="listCourse"
                  key={course}
                  onClick={() => setSelectedCourse(course)}
                  selected={selectedCourse === course}
                  sx={{
                    "&.Mui-selected": {
                      borderRadius: "10px",
                      backgroundColor: "#9bf2df",
                      color: "#fff",
                      "&:hover": {
                        borderRadius: "10px",
                        color: "#fff",
                      },
                    },
                    "&:hover": {
                      borderRadius: "10px",
                      color: "#fff",
                      backgroundColor: "#e0f7fa",
                    },
                  }}
                >
                  <ListItemText primary={course} />
                </ListItemButton>
              ))}
            </List>
          </div>
          <div className="userSectionRow2">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Student Number</StyledTableCell>
                    <StyledTableCell align="left">Name</StyledTableCell>
                    <StyledTableCell align="right"></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users[selectedCourse]?.length > 0 ? (
                    users[selectedCourse].map((user, index) => (
                      <StyledTableRow key={user.id}>
                        <StyledTableCell>{user.studentNumber}</StyledTableCell>
                        <StyledTableCell align="left">
                          {user.name}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{ backgroundColor: "#1ab394", marginRight: 1 }}
                            onClick={() => handleOpenModal(user)}
                          >
                            <EditIcon />
                          </Button>
                          <Button
                            sx={{ backgroundColor: "#eb5455" }}
                            variant="contained"
                            color="secondary"
                            onClick={() =>
                              handleDeleteUser(selectedCourse, index)
                            }
                          >
                            <DeleteIcon />
                          </Button>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow>
                      <StyledTableCell colSpan={3} align="center">
                        No users found
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <NewUser
          onClose={handleCloseModal}
          onAddUser={handleAddUser}
          initialData={selectedUser}
        />
      )}
    </div>
  );
}

export default Four;
