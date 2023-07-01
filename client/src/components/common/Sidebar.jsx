import React, { useEffect, useState } from "react";
import {
    Box,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    Typography,
} from "@mui/material";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import assets from "../../assets/index";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import memoApi from "../../api/memoApi";
import { setMemo } from "../../redux/features/memoSlice";

function Sidebar() {

    const [activeIndex, setActiveIndex] = useState(0);

    const dispatch = useDispatch();

    const navigate = useNavigate();
    const user = useSelector((state) => state.user.value);
    const memos = useSelector((state) => state.memo.value);
    const { memoId } = useParams();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    useEffect(() => {
        const getMemos = async () => {
            try {
                const res = await memoApi.getAll();
                dispatch(setMemo(res));
            } catch (err) {
                alert(err)
            }
        }
        getMemos();
    }, [dispatch]);

    useEffect(() => {
        const activeIndex = memos.findIndex((e) => e._id === memoId);
        setActiveIndex(activeIndex);
    }, [navigate])

    const addMemo = async () => {
        try {
            const res = await memoApi.create();
            const newMemos = [res, ...memos];
            dispatch(setMemo(newMemos));
            navigate(`/memo/${res._id}`);
        } catch (err) {
            alert(err);
        }
    }

    return (
        <Drawer
            container={window.document.body}
            variant="permanent"
            open={true}
            sx={{ width: 250, height: "100vh" }}
        >
            <List sx={{ width: 250, height: "100vh", backgroundColor: assets.colors.secondary }}>
                <ListItemButton>
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography variant="body2" fontWeight="700">
                            {user.username}
                        </Typography>
                        <IconButton onClick={logout}>
                            <LogoutOutlinedIcon />
                        </IconButton>
                    </Box>
                </ListItemButton>
                <Box sx={{ paddingTop: "10px" }}></Box>
                <ListItemButton>
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography variant="body2" fontWeight="700">
                            お気に入り
                        </Typography>
                    </Box>
                </ListItemButton>
                <Box sx={{ paddingTop: "10px" }}></Box>
                <ListItemButton>
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography variant="body2" fontWeight="700">
                            プライベート
                        </Typography>
                        <IconButton onClick={() => addMemo()}>
                            <AddBoxOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </ListItemButton>
                {memos.map((item, index) => (
                    <ListItemButton
                        sx={{ pl: "20px" }}
                        component={Link}
                        to={`/memo/${item._id}`}
                        key={item._id}
                        selected={index === activeIndex}
                    >
                        <Typography>
                            {item.icon} {item.title}
                        </Typography>
                    </ListItemButton>
                ))}

            </List>
        </Drawer >
    );
}

export default Sidebar;
