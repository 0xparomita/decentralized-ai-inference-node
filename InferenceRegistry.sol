// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract InferenceRegistry {
    struct Request {
        address requester;
        string input;
        string output;
        bool completed;
    }

    uint256 public nextRequestId;
    mapping(uint256 => Request) public requests;

    event InferenceRequested(uint256 requestId, string modelInput);
    event InferenceCompleted(uint256 requestId, string result);

    function requestInference(string calldata modelInput) external {
        requests[nextRequestId] = Request(msg.sender, modelInput, "", false);
        emit InferenceRequested(nextRequestId, modelInput);
        nextRequestId++;
    }

    function submitInference(uint256 requestId, string calldata result, bytes32 proof) external {
        require(!requests[requestId].completed, "Already completed");
        
        // In a production DeAI system, 'proof' would be verified here 
        // against a ZK-circuit or optimistic challenge period.
        
        requests[requestId].output = result;
        requests[requestId].completed = true;

        emit InferenceCompleted(requestId, result);
    }
}
