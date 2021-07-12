import React from "react";
import {ClipboardCopyIcon, PhotographIcon} from "@heroicons/react/outline";

const IpfsHashPreview = ({hash}) => {
    const onViewImage = () => {
        window.open(`https://ipfs.trofi.one/ipfs/${hash}`)
    }

    const onCopyURI = () => {
        navigator.clipboard.writeText(`https://ipfs.trofi.one/ipfs/${hash}`)
    }

    return (
        <div
            className="mt-3 px-3 py-4 border border-green-300 rounded-md"
        >
            <span className="flex float-right">
                <a className="flex items-center text-sm text-gray-500 mr-3" onClick={onViewImage}>
                    <PhotographIcon className="inline-block h-4 w-4 mr-2"/>
                    image
                </a>

                <a className="flex items-center text-sm text-gray-500" onClick={onCopyURI}>
                    <ClipboardCopyIcon className="inline-block h-4 w-4 mr-2"/>
                    copy URI
                </a>
            </span>

            {String(hash).substring(0, 10) +
            "**********" +
            String(hash).substring(hash.length - 10, hash.length)}
        </div>
    );
}

export default IpfsHashPreview