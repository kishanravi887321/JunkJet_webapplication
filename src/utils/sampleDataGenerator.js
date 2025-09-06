import { WasteTransaction } from "../models/analytics.models.js";
import { User } from "../models/user.models.js";
import { updateUserAnalytics } from "../controllers/analytics.controllers.js";

// Sample data generation utility for testing
const generateSampleData = async (userEmail) => {
    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            console.log("User not found");
            return;
        }

        // Sample buyer data
        const sampleBuyers = [
            { email: "buyer1@example.com", orgName: "EcoRecycle Industries" },
            { email: "buyer2@example.com", orgName: "Green Solutions Ltd" },
            { email: "buyer3@example.com", orgName: "Urban Waste Management" },
            { email: "buyer4@example.com", orgName: "Sustainable Materials Co" }
        ];

        // Materials with realistic prices (in INR per kg)
        const materials = [
            { type: "plastic", price: 15 },
            { type: "paper", price: 8 },
            { type: "metal", price: 35 },
            { type: "glass", price: 5 },
            { type: "electronic", price: 120 },
            { type: "organic", price: 3 }
        ];

        // Generate sample transactions for the last 6 months
        const currentDate = new Date();
        const transactions = [];

        for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
            const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - monthOffset, 1);
            const transactionsPerMonth = Math.floor(Math.random() * 8) + 3; // 3-10 transactions per month

            for (let i = 0; i < transactionsPerMonth; i++) {
                const randomBuyer = sampleBuyers[Math.floor(Math.random() * sampleBuyers.length)];
                const randomMaterial = materials[Math.floor(Math.random() * materials.length)];
                const weight = Math.floor(Math.random() * 50) + 5; // 5-55 kg
                const transactionDate = new Date(
                    monthDate.getFullYear(),
                    monthDate.getMonth(),
                    Math.floor(Math.random() * 28) + 1
                );

                // Find or create buyer
                let buyer = await User.findOne({ email: randomBuyer.email });
                if (!buyer) {
                    buyer = new User({
                        userName: randomBuyer.orgName.replace(/\s+/g, '').toLowerCase(),
                        email: randomBuyer.email,
                        fullName: randomBuyer.orgName,
                        password: "defaultpassword123",
                        isPhase2User: true
                    });
                    await buyer.save();
                }

                const transaction = {
                    user: user._id,
                    buyer: buyer._id,
                    materialType: randomMaterial.type,
                    weight: weight,
                    pricePerKg: randomMaterial.price,
                    totalAmount: weight * randomMaterial.price,
                    transactionDate: transactionDate,
                    buyerOrgName: randomBuyer.orgName,
                    location: {
                        city: "Mumbai",
                        state: "Maharashtra",
                        country: "India"
                    }
                };

                transactions.push(transaction);
            }
        }

        // Insert all transactions
        await WasteTransaction.insertMany(transactions);
        
        // Update analytics
        await updateUserAnalytics(user._id);

        console.log(`Generated ${transactions.length} sample transactions for user ${userEmail}`);
        return transactions;
    } catch (error) {
        console.error("Error generating sample data:", error);
        throw error;
    }
};

export { generateSampleData };
