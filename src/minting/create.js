import React, {Component, createRef} from "react";
import '@toast-ui/editor/dist/toastui-editor.css';
import {Editor} from '@toast-ui/react-editor';
import {Button} from "antd";
import {uploadBuffer, uploadImage} from "../utils/ipfs";
import {upload} from "../utils/dao-functions";
import {create} from "../utils/nft-functions";
import MintSuccess from "../components/States/MintSuccess";
import IpfsHashPreview from "../components/shared/IpfsHashPreview";


class CreateItem extends Component {
    editorRef = createRef()

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            description: "",
            properties: "",
            files: [],
            loading: false,
            buffer: null,
            cover: "",
            uploading: false,
            error: false,
            errorMsg: "",
            success: false,
            editorMarkdown: "",
            markdownHash: ""
        };
        this.captureFile = this.captureFile.bind(this);
        this.reset = this.reset.bind(this);
    }

    handleEditorChange = () => {
        const editorInstance = this.editorRef.current.getInstance()
        const editorMarkdown = editorInstance.getMarkdown()

        this.setState({editorMarkdown: editorMarkdown})
    }

    captureFile(event, type) {
        event.preventDefault();
        const file = event.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            this.setState({buffer: Buffer.from(reader.result)});
            this.upload(type);
        };
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value,
            error: false,
        });
    }

    upload = async (type) => {
        this.setState({uploading: true});
        const {buffer} = this.state;
        const result = await uploadImage(buffer);
        if (result) {
            if (type === "file") {
                const files = this.state.files;
                files[files.length] = result;
                this.setState({files});
                this.setState({uploading: false});
            } else {
                this.setState({
                    uploading: false,
                    cover: result,
                });
            }
        }
    };

    mintNFT = async () => {
        const {name, description, files, cover, editorMarkdown} = this.state;
        if (!name) {
            this.setState({error: true, errorMsg: "Title cannot be empty"});
        } else if (!description) {
            this.setState({error: true, errorMsg: "Description cannot be empty"});
        } else if (!cover) {
            this.setState({
                error: true,
                errorMsg: "Upload cover image to mint NFT",
            });
        } else if (files.length < 1) {
            this.setState({
                error: true,
                errorMsg: "Upload files to represent the NFT",
            });
        } else {
            this.setState({loading: true});

            // attempt to upload markdown if content exists
            if (this.state.editorMarkdown !== "") {
                const markdownHash = await uploadBuffer(Buffer.from(this.state.editorMarkdown))

                if (markdownHash) {
                    this.setState({markdownHash: markdownHash})
                }
            }

            const data = JSON.stringify({
                title: this.state.name,
                description: this.state.description,
                properties: this.state.properties,
                files: this.state.files,
                Address: this.props.address,
                cover: this.state.cover,
                markdownHash: this.state.markdownHash
            });

            // Seems like we are uploading the above data to ipfs
            // By calling the upload function in dao-functions.js
            // Why?
            const result = await upload(data);
            if (result) {
                const tx = await create(result, this.props.signer);
                if (tx) {
                    this.setState({
                        loading: false,
                        success: true,
                        files: [],
                        name: "",
                        description: "",
                        properties: "",
                        image: "",
                        cover: "",
                        markdownHash: ""
                    });
                }
            }
        }
    };

    reset = () => {
        this.setState({success: false});
    };

    render() {
        const {
            name,
            description,
            properties,
            files,
            cover,
            loading,
            uploading,
            error,
            errorMsg,
            success,
        } = this.state;
        const {open} = this.props;
        return success ? (
            <MintSuccess reset={this.reset}/>
        ) : (
            <div>
                <h1 className="text-xl mt-20">Create Item</h1>
                <div>
                    <div>
                        <span className="form-label">General Info</span>
                        <input
                            name="name"
                            placeholder="Name of Item"
                            onChange={(e) => this.handleChange(e)}
                            value={name}
                        />
                        <input
                            name="description"
                            placeholder="Description of Item"
                            onChange={(e) => this.handleChange(e)}
                            value={description}
                        />
                    </div>
                    <div className="pt-40">
                        <span className="form-label">Cover Image</span>
                        <input
                            name="image"
                            placeholder="Supporting Files (.png, .jpeg)"
                            type="file"
                            onChange={(e) => this.captureFile(e, "cover")}
                            accept=".png,.jpeg,.jpg"
                            id="fileupload"
                        />

                        {cover && (<IpfsHashPreview hash={cover}/>)}
                    </div>
                    <div className="pt-40">
                        <span className="form-label">NFT Info</span>
                        <input
                            name="properties"
                            placeholder="Properties(Optional)"
                            onChange={(e) => this.handleChange(e)}
                            value={properties}
                        />
                        <input
                            name="image"
                            placeholder="Supporting Files (.png, .jpeg, .zip, .pdf)"
                            type="file"
                            onChange={(e) => this.captureFile(e, "file")}
                            accept=".png,.jpeg,.jpg"
                            id="fileupload"
                        />
                        {files.length > 0 ? (
                            <div className="pt-40">
                                <span className="form-label" style={{marginTop: "30px"}}>
                                  NFT Info
                                </span>

                                {files.map((data, index) => {
                                    return <IpfsHashPreview key={index} hash={data}/>
                                })}
                            </div>
                        ) : null}
                        <div className="pt-40">
                            <Editor
                                previewStyle="tab"
                                height="400px"
                                initialEditType="markdown"
                                useCommandShortcut={true}
                                hideModeSwitch={true}
                                placeholder="Describe your NFT..."
                                ref={this.editorRef}
                                onChange={this.handleEditorChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="pt-40">
                    {this.props.connected ? (
                        <Button
                            loading={loading || uploading}
                            onClick={() => {
                                this.mintNFT();
                            }}
                            className="primary-button"
                        >
                            {uploading ? "Uploading Image" : "Create Now"}
                        </Button>
                    ) : (
                        <Button
                            onClick={() => {
                                open();
                            }}
                            className="primary-button"
                        >
                            Connect Wallet
                        </Button>
                    )}
                </div>
                <div className="pt-20">
                    {error ? <p className="error-msg">{errorMsg}</p> : null}
                </div>
            </div>
        );
    }
}

export default CreateItem;
