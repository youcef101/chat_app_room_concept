import moment from "moment"
export const formatMessage = (username, content) => {
    return {
        username,
        content,
        time: moment().format('h:mm a')
    }
}