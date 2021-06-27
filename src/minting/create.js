import React, { Component } from "react";
import { Button } from "antd";
import { uploadImage } from "../utils/ipfs";
import { upload } from "../utils/dao-functions";
import { create } from "../utils/nft-functions";

class CreateItem extends Component {
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
    };
    this.captureFile = this.captureFile.bind(this);
  }

  captureFile(event, type) {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer.from(reader.result) });
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
    this.setState({ uploading: true });
    const { buffer } = this.state;
    const result = await uploadImage(buffer);
    if (result) {
      if (type === "file") {
        const files = this.state.files;
        files[files.length] = result;
        this.setState({ files });
        this.setState({ uploading: false });
      } else {
        this.setState({
          uploading: false,
          cover: result,
        });
      }
    }
  };

  mintNFT = async () => {
    const { name, description, files } = this.state;
    if (!name) {
      this.setState({ error: true, errorMsg: "Title cannot be empty" });
    } else if (!description) {
      this.setState({ error: true, errorMsg: "Description cannot be empty" });
    } else if (files.length < 1) {
      this.setState({
        error: true,
        errorMsg: "Upload files to represent the NFT",
      });
    } else {
      this.setState({ loading: true });
      const data = JSON.stringify({
        title: this.state.name,
        description: this.state.description,
        properties: this.state.properties,
        files: this.state.files,
        Address: this.props.address,
        cover: this.state.cover,
      });
      const result = await upload(data);
      if (result) {
        const tx = await create(result, this.props.signer);
        if (tx) {
          this.setState({
            loading: false,
            files: [],
            name: "",
            description: "",
            properties: "",
            image: "",
            cover: "",
          });
        }
      }
    }
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
    } = this.state;
    const { open } = this.props;
    return (
      <div>
        <h1 className="mt-20">Create Item</h1>
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
            {cover ? (
              <div
                className="supporting-file"
                onClick={() => window.open(`https://ipfs.io/ipfs/${cover}`)}
              >
                {String(cover).substring(0, 10) +
                  "**********" +
                  String(cover).substring(cover.length - 10, cover.length)}
              </div>
            ) : null}
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
                <span className="form-label" style={{ marginTop: "30px" }}>
                  NFT Info
                </span>
                {files.map((data, index) => {
                  return (
                    <div
                      className="supporting-file"
                      key={index}
                      onClick={() =>
                        window.open(`https://ipfs.io/ipfs/${data}`)
                      }
                    >
                      {String(data).substring(0, 10) +
                        "**********" +
                        String(data).substring(data.length - 10, data.length)}
                    </div>
                  );
                })}
              </div>
            ) : null}
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
