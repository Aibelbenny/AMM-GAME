import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import { db } from "./firebase.js";


// =====================================================
// SAVE SCORE
// =====================================================

export async function saveScore(name, score) {

    if (!name || name.trim() === "") {

        alert("Please enter your name!");

        return;

    }

    try {

        await addDoc(
            collection(db, "leaderboard"),
            {
                name: name.trim().substring(0, 20),
                score: Number(score),
                createdAt: Date.now()
            }
        );

        alert("🏆 Score saved!");

        await loadLeaderboard();

    }
    catch (error) {

        console.error(
            "Error saving score:",
            error
        );

        alert(
            "Could not save score."
        );

        throw error;

    }

}


// =====================================================
// LOAD TOP 10
// =====================================================

export async function loadLeaderboard() {

    const leaderboardList =
        document.getElementById(
            "leaderboardList"
        );

    if (!leaderboardList) return;


    leaderboardList.innerHTML =
        `<p class="loading">Loading leaderboard...</p>`;


    try {

        const leaderboardQuery = query(

            collection(
                db,
                "leaderboard"
            ),

            orderBy(
                "score",
                "desc"
            ),

            limit(10)

        );


        const snapshot =
            await getDocs(
                leaderboardQuery
            );


        leaderboardList.innerHTML = "";


        if (snapshot.empty) {

            leaderboardList.innerHTML =
                `<p class="no-scores">
                    No scores yet!
                </p>`;

            return;

        }


        let position = 1;


        snapshot.forEach(doc => {

            const data = doc.data();


            const row =
                document.createElement("div");


            row.className =
                "leaderboard-row";


            // =================================================
            // TOP 3
            // =================================================

            if (position === 1) {

                row.classList.add(
                    "rank-1"
                );

            }

            else if (position === 2) {

                row.classList.add(
                    "rank-2"
                );

            }

            else if (position === 3) {

                row.classList.add(
                    "rank-3"
                );

            }


            // Medal

            let medal = "";

            if (position === 1) {

                medal = "🥇";

            }

            else if (position === 2) {

                medal = "🥈";

            }

            else if (position === 3) {

                medal = "🥉";

            }


            row.innerHTML = `

                <span class="player-name">

                    <span class="rank-medal">
                        ${medal}
                    </span>

                    <span>
                        ${position}.
                        ${escapeHTML(data.name)}
                    </span>

                </span>


                <strong class="player-score">

                    ${Number(data.score)}

                </strong>

            `;


            leaderboardList.appendChild(
                row
            );


            position++;

        });

    }
    catch (error) {

        console.error(
            "Error loading leaderboard:",
            error
        );


        leaderboardList.innerHTML = `

            <p class="leaderboard-error">

                ⚠️ Unable to load leaderboard.

            </p>

        `;

    }

}


// =====================================================
// PROTECT AGAINST HTML INJECTION
// =====================================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}