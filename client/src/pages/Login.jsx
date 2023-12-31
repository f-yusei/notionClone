import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { LoadingButton } from "@mui/lab";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../api/authApi.js";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();

  const [usernameErrText, setUsernmaeErrText] = useState("");
  const [passwordErrText, setPasswordErrText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUsernmaeErrText("");
    setPasswordErrText("");

    const data = new FormData(e.target);
    const username = data.get("username").trim();
    const password = data.get("password").trim();

    let error = false;

    if (username === "") {
      error = true;
      setUsernmaeErrText("お名前を入力してください");
    }
    if (password === "") {
      error = true;
      setPasswordErrText("パスワードを入力してください");
    }

    if (error) return;

    setLoading(true);

    //新規登録APIを叩く
    try {
      const res = await authApi.login({
        username,
        password,
      });
      setLoading(false);
      localStorage.setItem("token", res.token);
      console.log("ログインに成功しました");
      navigate("/");
    } catch (err) {
      const errors = err.data.errors;
      console.log(errors);
      errors.forEach((err) => {
        if (err.param === "username") {
          setUsernmaeErrText(err.msg);
        }
        if (err.param === "password") {
          setPasswordErrText(err.msg);
        }
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          id="username"
          label="お名前"
          margin="normal"
          name="username"
          required
          helperText={usernameErrText}
          error={usernameErrText !== ""}
          disabled={loading}
        />
        <TextField
          fullWidth
          id="password"
          label="パスワード"
          margin="normal"
          name="password"
          type="password"
          required
          helperText={passwordErrText}
          error={passwordErrText !== ""}
          disabled={loading}
        />
        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          fullWidth
          type="submit"
          loading={loading}
          color="primary"
          variant="outlined"
        >
          ログイン
        </LoadingButton>
      </Box>
      <Button component={Link} to="/register">
        すでにアカウントを持っていませんか？新規登録
      </Button>
    </>
  );
}

export default Login;
