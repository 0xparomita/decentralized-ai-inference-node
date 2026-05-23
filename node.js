const { ethers } = require("ethers");
const tf = require("@tensorflow/tfjs-node");
require("dotenv").config();

const ABI = [
  "event InferenceRequested(uint256 requestId, string modelInput)",
  "function submitInference(uint256 requestId, string result, bytes32 proof) external"
];

async function runNode() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, ABI, wallet);

    console.log("--- DeAI Inference Node Active ---");

    contract.on("InferenceRequested", async (requestId, modelInput) => {
        console.log(`[Request] ID: ${requestId} | Input: ${modelInput}`);

        // Simulate AI Inference logic
        // In production, load a real model: const model = await tf.loadLayersModel('...');
        const result = `AI_Response_to_${modelInput}`;
        const proof = ethers.keccak256(ethers.toUtf8Bytes(result));

        try {
            const tx = await contract.submitInference(requestId, result, proof);
            await tx.wait();
            console.log(`[Success] Inference submitted for ID: ${requestId}`);
        } catch (err) {
            console.error(`[Error] Failed submission: ${err.message}`);
        }
    });
}

runNode().catch(console.error);
