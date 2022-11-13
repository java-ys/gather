const port = 7888
const folderName = 'project';



const express = require("express")
const app = express()
app.use(express.static(folderName))
app.listen(port, () => {
    console.log(`服务开启在${port}端口`)
})
