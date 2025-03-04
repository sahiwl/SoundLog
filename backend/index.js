// import express from "express"
const express = require("express")

const app = express()

const port = 3000


app.get('/', (req, res) => {
    res.send("Server is live")
})

app.listen(port,()=>{
    console.log(`This server is running on port ${port}`);
})