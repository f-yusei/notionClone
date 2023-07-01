import { Box, IconButton, TextField, alpha } from '@mui/material'
import React, { useEffect, useState } from 'react'
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined"
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined"
import { useNavigate, useParams } from 'react-router-dom';
import memoApi from '../api/memoApi';
import { useDispatch, useSelector } from 'react-redux';
import { setMemo } from '../redux/features/memoSlice';
import EmojiPicker from '../components/common/EmojiPicker';

function Memo() {

    const { memoId } = useParams();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const memos = useSelector((state) => state.memo.value);

    useEffect(() => {
        const getMemo = async () => {
            try {
                const res = await memoApi.getOne(memoId);
                setTitle(res.title);
                setIcon(res.icon);
                setDescription(res.description)
            } catch (err) {
                alert(err);
            }
        }
        getMemo();
    }, [memoId])

    let timer;
    const timeout = 500;

    const updateTitle = async (e) => {
        clearTimeout(timer);
        const newTitle = e.target.value;
        setTitle(newTitle);

        timer = setTimeout(async () => {
            try {
                await memoApi.update(memoId, { title: newTitle })
            } catch (err) {
                alert(err);
            }
        }, timeout)
    }

    const updateDescription = async (e) => {
        clearTimeout(timer);
        const newDescription = e.target.value;
        setDescription(newDescription);

        timer = setTimeout(async () => {
            try {
                await memoApi.update(memoId, { description: newDescription })
            } catch (err) {
                alert(err);
            }
        }, timeout)
    }

    const deleteMemo = async () => {
        try {
            const deletedMemo = await memoApi.delete(memoId);
            const mewMemos = memos.filter((e) => e._id !== deletedMemo._id);
            if (mewMemos.length === 0) {
                navigate("/memo");
            } else {
                navigate(`/memo/${mewMemos[0]._id}`)
            }
            dispatch(setMemo(mewMemos));
        } catch (err) {
            alert(err);
        }
    }

    const onIconChange = async (newIcon) => {
        let temp = [...memos];
        const index = temp.findIndex((e) => e._id === memoId);
        temp[index] = { ...temp[index], icon: newIcon };
        setIcon(newIcon);
        dispatch(setMemo(temp))
        try {
            await memoApi.update(memoId, { icon: newIcon })
        } catch (err) {

        }
    }

    return (
        <>
            <Box sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
            }}>
                <IconButton>
                    <StarBorderOutlinedIcon />
                </IconButton>
                <IconButton variant="outlined" color='error' onClick={deleteMemo}>
                    <DeleteOutlinedIcon />
                </IconButton>
            </Box>
            <Box sx={{ padding: "10px 50px" }}>
                <Box>
                    <EmojiPicker icon={icon} onChange={onIconChange} />
                    <TextField
                        onChange={updateTitle}
                        value={title}
                        placeholder='無題' variant='outlined' fullWidth
                        sx={{
                            ".MuiOutlinedInput-input": { padding: 0 },
                            ".MuiOutlinedInput-notchedOutline": { border: "none" },
                            ".MuiOutlinedInput-input": { fontSize: "2.0rem", fontWeight: "700" }
                        }}
                    />
                    <TextField
                        onChange={updateDescription}
                        value={description}
                        placeholder='追加'
                        variant='outlined'
                        fullWidth
                        multiline
                        sx={{
                            ".MuiOutlinedInput-input": { padding: 0 },
                            ".MuiOutlinedInput-notchedOutline": { border: "none" },
                            ".MuiOutlinedInput-input": { fontSize: "1.0rem", }
                        }}
                    />
                </Box>
            </Box>
        </>
    )
}

export default Memo