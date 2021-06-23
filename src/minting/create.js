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
    };
    this.captureFile = this.captureFile.bind(this);
  }

  captureFile(event) {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer.from(reader.result) });
      this.upload();
    };
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  upload = async () => {
    const { buffer } = this.state;
    const result = await uploadImage(buffer);
    if (result) {
      const files = this.state.files;
      files[files.length] = result;
      console.log(files);
      this.setState({ files });
    }
  };

  mintNFT = async () => {
    this.setState({ loading: true });
    const data = JSON.stringify({
      title: this.state.name,
      description: this.state.description,
      properties: this.state.properties,
      files: this.state.files,
      Address: this.props.address,
    });
    const result = await upload(data);
    if (result) {
      const tx = await create(result, this.props.signer);
      if (tx) {
        this.setState({ loading: false });
      }
    }
  };

  render() {
    const { name, description, properties, files, loading } = this.state;
    return (
      <div>
        <h1>Create Item</h1>
        <p>Only approved merchants can create NFTs in the platform.</p>
        <div className="pt-20">
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
              onChange={this.captureFile}
              accept=".png,.jpeg,.jpg"
              id="fileupload"
            />
            {files.map((data, index) => {
              return (
                <>
                  <a
                    href={`https://ipfs.io/ipfs/${data}`}
                    key={index}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {data}
                  </a>
                  <br />
                </>
              );
            })}
          </div>
        </div>
        <div className="pt-40">
          {this.props.connected ? (
            <Button
              loading={loading}
              onClick={() => {
                this.mintNFT();
              }}
              className="primary-button"
            >
              Create Now
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
      </div>
    );
  }
}

export default CreateItem;
