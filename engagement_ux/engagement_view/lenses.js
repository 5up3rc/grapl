// Stylesheets
const engagement_edge = "https://mv92gmusv4.execute-api.us-east-1.amazonaws.com/prod/";

console.log('Loaded index.js');

// const engagement_edge = "https://mv92gmusv4.execute-api.us-east-1.amazonaws.com/prod/";

// console.log(`Connecting to ${engagement_edge}`);



const getLenses = async () => {
    const res = await fetch(`${engagement_edge}getLenses`, {
        method: 'post',
        body: JSON.stringify({
            'prefix': '',
        }),
        credentials: 'include',
    });
    const jres = await res.json();

    return jres['success'];
};

const genLensTable = (lens) => {

    let header = '<thead class="thead"><tr>';
    let output = '<tbody><tr id="lens">';
    header += `<th scope="col" class = "header">lens</th>`;
    header += `<th scope="col" class = "header">score</th>`;
    header += `<!--<th scope="col" class = "header">link</th>-->`;

    output += `<td id=${lens.lens} class = "lens">${lens.lens}</td>`;
    output += `<td class = "score">${lens.score}</td>`;
    // output += `<td><a href="${engagement_edge}lens.html?lens=${lens.lens}">link</td></a>>`;
    // output += `<td><a href="lens.html?lens=${lens.lens}">link</a></td>`;


    return `${header}</tr></thead>` + `${output}</tr><tbody>`;
};

const getLensesLoop = async () => {
    const lensRes = await getLenses();
    const lenses = (lensRes).lenses;
    console.log(lenses);

    // if (lenses.length === 0) {
    //     console.log("No active lenses");
    //
    //     setTimeout(async () => {
    //         await getLensesLoop();
    //     }, 1000);
    //     return
    // }

    const lenseTable = document.getElementById('LenseTable');

    const lensRows = [];

    for (const lens of lenses) {
        const s = genLensTable(lens);
        lensRows.push(s);
    }
    // Sort the lenses by their score
    lensRows.sort((row_a, row_b) => {
        return row_a.score - row_b.score
    });
    const lensRowsStr = lensRows.join("");
    lenseTable.innerHTML = `<table>${lensRowsStr}</table>`;
    console.log("ANDREA RULES")
    for (const lens of lenses){
        console.log("LENS.LENS" + lens.lens)
        document.getElementById(lens.lens).addEventListener("click", async () => {
            console.log("starting lens loop for" + lens.lens)
            await startLensLoop(lens.lens);
        })
    }

    setTimeout(async () => {
        await getLensesLoop();
    }, 1000)
};

const startLensLoop = async(lens) => {
    // const lens = new URLSearchParams(window.location.search).get('lens');

    if (lens === null || lens.length <= 0) {
        console.error('Failed to retrieve egId from url');
        return;
    }

    document.getElementById('LensHeader').innerText = `Lens ${lens}`;

    // console.log("Initializing graphManager with, ", initGraph);
    const graphManager = new GraphManager(
        {nodes: [], links: []}, '2d'
    );
    console.log("Starting update loop");
    await updateLoop(graphManager, lens);
}

document.addEventListener('DOMContentLoaded', async (event) => {
    console.log('DOMContentLoaded');
    getLensesLoop();
});