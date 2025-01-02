import { Box } from "@mui/material";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        paddingX: 2,
        paddingY: 1,
        borderRadius: "16px",
        backgroundColor: "purple",
        color: "white",
        cursor: "pointer",
        fontSize: 15,
        margin: 0.5,
      }}
      onClick={handleFunction}
    >
      {user.name}
      <Box
        component="i"
        className="fa-solid fa-xmark"
        sx={{ marginLeft: 1, fontSize: 12 }}
      ></Box>
    </Box>
  );
};

export default UserBadgeItem;
