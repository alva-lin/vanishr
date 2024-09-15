# Vanishr

Vanishr is a self-destructing file sharing project based on web3 storage.

## Project Overview

Vanishr aims to provide a secure and private file sharing platform. By leveraging web3 technology and the Walrus storage system, it achieves encrypted file storage and self-destructing functionality.

## Key Features

1. Encrypt and upload files, generating shareable links
2. Parse shared links, retrieve files from the Walrus storage system, and download decrypted content
3. Self-destructing mechanism (to be implemented)

## Current Progress

Currently, the project has implemented file upload and download functionality through the public aggregator/publisher API. Direct interaction with sui blockchain has been implemented for handling file storage and retrieval.

## TODO

1. [ ] Integrate Sui & Move contracts, implement wallet connection, and allow users to manage their shares
2. [ ] Enhance UI/UX: implement file size limits, expiration time settings, display upload/download progress, and provide more user-friendly notifications
3. [ ] Support folder upload and download
4. [ ] Add permission settings, allowing users to specify share recipients

## How to Contribute

We welcome community members to participate in the development of Vanishr. If you have any suggestions or want to contribute code, please submit an issue or pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
