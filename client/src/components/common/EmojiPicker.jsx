import { Box, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useState } from 'react'
import Picker from '@emoji-mart/react'

const EmojiPicker = (props) => {
    const [selectedEmoji, setSelectedEmoji] = useState();
    const [isShowPicker, setIsShowPicker] = useState(false);

    const showPicker = () => { setIsShowPicker(!isShowPicker) }

    const selectEmoji = (e) => {
        const emojiCode = e.unified.split("-");
        let codesArray = [];
        emojiCode.forEach((el) => codesArray.push("0x" + el));
        const emoji = String.fromCodePoint(...codesArray);
        setIsShowPicker(false);
        props.onChange(emoji);
    }

    useEffect(() => {
        setSelectedEmoji(props.icon)
    }, [props.icon])
    return (
        <Box>
            <Typography
                variant='h3'
                fontWeight="700"
                sx={{ cursor: "pointer" }}
                onClick={showPicker} >
                {selectedEmoji}
            </Typography>
            <Box sx={{ display: isShowPicker ? "block" : "none", position: "absolute", zIndex: "100" }}>
                <Picker onEmojiSelect={selectEmoji} />
            </Box>
        </Box>
    )
}

export default EmojiPicker