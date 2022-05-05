import logger from 'pino'
import dayjs from 'dayjs'
const log = logger({
    prettifier:true,
    base:{
        pid:false
    },
    timestamp:()=>`Time: ${dayjs().format()}`
})


export  {log}