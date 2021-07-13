import React, {useState} from "react"
import ReactMarkdown from 'react-markdown'
import {readFromIPFS} from "../../utils/ipfs"

const MarkdownViewer = ({markdownHash}) => {
    // Hard coding this value here but there should
    // be a better way of retrieving this URL
    const ipfsURI = "https://ipfs.trofi.one/ipfs/"
    const [markdownContent, setMarkdownContent] = useState(null)

    // Fetch Markdown from ipfs
    readFromIPFS(ipfsURI + markdownHash).then((resp) => setMarkdownContent(resp))

    return (
        <ReactMarkdown>{markdownContent}</ReactMarkdown>
    )
}

export default MarkdownViewer