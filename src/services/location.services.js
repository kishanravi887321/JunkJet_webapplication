import h3 from "h3-js";
import { getPreciseDistance } from "geolib";
import { Phase1User } from "../models/phase1user.models.js";
import { Phase2User } from "../models/phase2user.models.js";
import { User } from "../models/user.models.js";

async function findPhase2Buyers(email, materialType, maxResults = 10, maxDistanceKm = 2000) {
    try {
        // Step 1: Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User not found with email:", email);
            return [];
        }

        // Step 2: Get user's household location
        const household = await Phase1User.findOne({ user: user._id });
        if (!household || !household.address || isNaN(household.address.latitude) || isNaN(household.address.longitude)) {
            console.log("❌ Household location not found or incomplete.");
            return [];
        }

        const householdLat = household.address.latitude;
        const householdLng = household.address.longitude;
        console.log(`📍 Household Location: [Lat: ${householdLat}, Lng: ${householdLng}]`);

        // Step 3: Clean materialType (trim and lowercase)
        const formattedMaterialType = materialType ? materialType.trim().toLowerCase() : "";

        // Step 4: Define search parameters
        const minResolution = 4;
        const maxResolution = 8;
        let foundBuyers = [];

        for (let resolution = maxResolution; resolution >= minResolution; resolution--) {
            console.log(`🔍 Searching with resolution: ${resolution}`);
            const householdHex = h3.latLngToCell(householdLat, householdLng, resolution);

            let radius = 1;
            while (radius <= 100) {
                console.log(`🔍 Searching in hex radius: ${radius} at resolution ${resolution}...`);
                const searchHexIds = new Set(h3.gridDisk(householdHex, radius));

                // **Updated Query**: Matches buyers using hexIds at specific resolution
                const hexQuery = [...searchHexIds].map(hex => `location.hexIds.${resolution}`);
                let query = { $or: hexQuery.map(hexField => ({ [hexField]: { $exists: true } })) };

                // If materialType is not "Any", filter by specific materialType
                if (formattedMaterialType !== "any") {
                    query.materialType = formattedMaterialType;
                }

                foundBuyers = await Phase2User.find(query).limit(maxResults);

                if (foundBuyers.length > 0) {
                    // Step 5: Calculate distances and filter results
                    const buyersWithDistance = foundBuyers.map(buyer => {
                        const distanceKm = getPreciseDistance(
                            { latitude: householdLat, longitude: householdLng },
                            { latitude: buyer.location.latitude, longitude: buyer.location.longitude }
                        ) / 1000; // Convert to km

                        console.log(`🔎 Checking Buyer: ${buyer.orgName}, Distance: ${distanceKm.toFixed(2)} km`);

                        return {
                            orgName: buyer.orgName,
                            materialType: buyer.materialType,
                            distanceKm: Number(distanceKm.toFixed(2)),
                            contact: buyer.orgNumber,
                            locationUrl: buyer.locationUrl,
                            hexId: buyer.location.hexIds[resolution] // Matching hex at this resolution
                        };
                    }).filter(buyer => buyer.distanceKm <= maxDistanceKm);

                    if (buyersWithDistance.length > 0) {
                        console.log(`✅ Found ${buyersWithDistance.length} buyers within ${maxDistanceKm} km!`);
                        return buyersWithDistance.sort((a, b) => a.distanceKm - b.distanceKm);
                    }
                }
                radius += 35;
            }
        }

        console.log(`🚨 No Phase2 buyers found within ${maxDistanceKm} km.`);
        return [];
    } catch (error) {
        console.error("⚠️ Error searching Phase2 Buyers:", error);
        return [];
    }
}

export { findPhase2Buyers };
