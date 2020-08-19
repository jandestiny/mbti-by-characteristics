var mbti_data = [
    {
        type: "ISTJ",
        characteristics: ["Responsible", "Sincere", "Analytical", "Reserved", "Realistic", "Systematic"],
        description: "Hardworking and trustworthy with sound practical judgement."
    },
    {
        type: "ISFJ",
        characteristics: ["Warm", "Considerate", "Gentle", "Responsible", "Pragmatic", "Thorough"],
        description: "Devoted caretakers who enjoy being helpful to others."
    },
    {
        type: "INFJ",
        characteristics: ["Idealistic", "Organized", "Insightful", "Dependable", "Compassionate", "Gentle"],
        description: "Seek harmony and cooperation, enjoy intellectual stimulation."
    },
    {
        type: "INTJ",
        characteristics: ["Innovative", "Independent", "Strategic", "Logical", "Reserved", "Insightful"],
        description: "Driven by their own original ideas to achieve improvements."
    },
    {
        type: "ISTP",
        characteristics: ["Action-oriented", "Logical", "Analytical", "Spontaneous", "Reserved", "Independent"],
        description: "Enjoy adventure, skilled at understanding how mechanical things work."
    },
    {
        type: "ISFP",
        characteristics: ["Gentle", "Sensitive", "Nurturing", "Helpful", "Flexible", "Realistic"],
        description: "Seek to create a personal environment that is both beautiful and practical."
    },
    {
        type: "INFP",
        characteristics: ["Sensitive", "Creative", "Idealistic", "Perceptive", "Caring", "Loyal"],
        description: "Value inner harmony and personal growth, focus on dreams and possibilities."
    },
    {
        type: "INTP",
        characteristics: ["Intellectual", "Logical", "Precise", "Reserved", "Flexible", "Imaginative"],
        description: "Original thinkers who enjoy speculation and creative problem solving"
    },
    {
        type: "ESTP",
        characteristics: ["Outgoing", "Realistic", "Action-oriented", "Curious", "Versatile", "Spontaneous"],
        description: "Pragmatic problem solvers and skillful negotiators."
    },
    {
        type: "ESFP",
        characteristics: ["Playful", "Enthusiastic", "Friendly", "Spontaneous", "Tactful", "Flexible"],
        description: "Have strong common sense, enjoy helping people in tangible ways."
    },
    {
        type: "ENFP",
        characteristics: ["Enthusiastic", "Creative", "Spontaneous", "Optimistic", "Supportive", "Playful"],
        description: "Value inspiration, enjoy starting new projects, see potential in others."
    },
    {
        type: "ENTP",
        characteristics: ["Inventive", "Enthusiastic", "Strategic", "Enterprising", "Inquisitive", "Versatile"],
        description: "Enjoy new ideas and challenges, value inspiration."
    },
    {
        type: "ESTJ",
        characteristics: ["Efficient", "Outgoing", "Analytical", "Systematic", "Dependable", "Realistic"],
        description: "Like to run the show and get things done in an orderly fashion."
    },
    {
        type: "ESFJ",
        characteristics: ["Friendly", "Outgoing", "Reliable", "Conscientious", "Organized", "Practical"],
        description: "Seek to be helpful and please others, enjoy being active and productive"
    },
    {
        type: "ENFJ",
        characteristics: ["Caring", "Enthusiastic", "Idealistic", "Organized", "Diplomatic", "Responsible"],
        description: "Skilled communicators who value connection with people."
    },
    {
        type: "ENTJ",
        characteristics: ["Strategic", "Logical", "Efficient", "Outgoing", "Ambitious", "Independent"],
        description: "Effective organizers of people and long-range planners."
    }
]

var current_choices = []
var max_items_per_row = 9

addHtmlObjectsToTable(createHtmlElementsFromCharacteristics(extractUniqueCharacteristics(convertDataToTuples(mbti_data))))

function clearCurrentChoices()
{
    current_choices = []
}

function updateResults()
{
    if (current_choices.length == 0) {
        clearResults()
        return
    }

    let allData = mbti_data

    allData.forEach(element =>
    {
        element["counter"] = 0
    });

    for (let i = 0; i < current_choices.length; i++) {
        for (let j = 0; j < allData.length; j++) {
            if (allData[j].characteristics.includes(current_choices[i])) {
                allData[j].counter++
            }
        }
    }

    allData.sort((a, b) => b.counter - a.counter)
    console.table(allData)

    setResults(allData)
}

function setResults(rankedData)
{
    let firstPlace = document.getElementById("result1")
    let secondPlace = document.getElementById("result2")
    let thirdPlace = document.getElementById("result3")

    firstPlace.innerHTML = rankedData[0].type + " (" + rankedData[0].counter + ")"
    secondPlace.innerHTML = rankedData[1].type + " (" + rankedData[1].counter + ")"
    thirdPlace.innerHTML = rankedData[2].type + " (" + rankedData[2].counter + ")"

    firstPlace.appendChild(createButtonWithDescription(rankedData[0]))
    secondPlace.appendChild(createButtonWithDescription(rankedData[1]))
    thirdPlace.appendChild(createButtonWithDescription(rankedData[2]))

}

function clearResults()
{
    let firstPlace = document.getElementById("result1")
    let secondPlace = document.getElementById("result2")
    let thirdPlace = document.getElementById("result3")

    firstPlace.innerHTML = "..."
    secondPlace.innerHTML = "..."
    thirdPlace.innerHTML = "..."
}

function createButtonWithDescription(mbti)
{
    let button = document.createElement("button")
    button.innerHTML = "More info"
    button.onclick = function ()
    {
        alert(mbti.type + "-types: " + mbti.description)
    }

    return button
}

//After clicking on an adjective, check if it should be removed or added to selection
function addOrRemoveChoice(choice)
{
    let characteristic = choice.getAttribute("data-characteristic")

    if (current_choices.includes(characteristic)) {
        current_choices = current_choices.filter(singleChoice => singleChoice != characteristic)
        choice.classList.remove("clicked")
    } else {
        current_choices.push(characteristic)
        choice.classList.add("clicked")
    }

    updateResults()
    console.table(current_choices)
}

//From overall data, create 1:1-tuples of type: (mbti-type, adjective)
function convertDataToTuples(data)
{
    let tuples = []

    for (let i = 0; i < data.length; i++) {
        let currentType = data[i]

        for (let j = 0; j < currentType.characteristics.length; j++) {
            let currentCharacteristic = currentType.characteristics[j]
            tuples.push({ type: currentType.type, characteristic: currentCharacteristic })
        }
    }

    return tuples
}

//Get unique values from all characteristics. e.g. ["Hi", "Hi", "Bye"] -> ["Hi", "Bye"]
function extractUniqueCharacteristics(tuples)
{
    let unique = []

    for (let i = 0; i < tuples.length; i++) {
        let singleTuple = tuples[i]

        if (!unique.includes(singleTuple.characteristic)) {
            unique.push(singleTuple.characteristic)
        }
    }

    return unique
}

function createHtmlElementsFromCharacteristics(characteristics)
{
    let htmlObjects = []

    for (let i = 0; i < characteristics.length; i++) {
        let singleCharacteristic = characteristics[i];

        let td = document.createElement("td")
        let container = document.createElement("div")
        container.setAttribute("class", "container")

        let span = document.createElement("span")
        span.setAttribute("class", "floating")
        span.setAttribute("data-characteristic", singleCharacteristic)
        span.innerHTML = singleCharacteristic
        span.addEventListener("click", function ()
        {
            addOrRemoveChoice(this)
        })

        container.appendChild(span)
        td.appendChild(container)
        htmlObjects.push(td)
    }

    return htmlObjects
}

function addHtmlObjectsToTable(objects)
{
    let table = document.getElementById("floatingarea").children[0]
    let floatingarea_rows = document.getElementById("floatingarea").children[0].children
    let lastRow = floatingarea_rows[floatingarea_rows.length - 1]

    for (let i = 0; i < objects.length; i++) {
        let singleObject = objects[i]

        if (lastRow.children.length >= max_items_per_row) {
            let newLastRow = document.createElement("tr")
            table.appendChild(newLastRow)
            lastRow = newLastRow
        }

        lastRow.appendChild(singleObject)
    }
}


