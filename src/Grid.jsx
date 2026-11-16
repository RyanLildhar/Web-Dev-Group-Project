import Card from './Card'

/**@param {Dict[]} elements */
function cards(elements, cardActions) {
    return elements.map((element) => <Card
        key={element.number}
        element={element}
        onClick={() => cardActions.setCurrentElement(element)}
        isFavourite={cardActions.isFavourite(element.number)}
        onToggleFavourite={cardActions.toggleFavourite}
    />)
}

/**Obtain elements by atomic number.
 *@param {Dict[]} els: List of elements
 @param {Number[]} ts: List of atomic numbers of target elements*/
function getElements(els, ...args) {
    const start = args[0]
    const end = args[1]
    const elements = [...els]
    const size = end - start
    const ts = [...Array(size + 1).keys()].map(i => i + start)
    console.log(ts)
    return elements.filter((e) => ts.includes(e.number))
}

function createRow(els, start, end, cardActions) {
    return <tr>{cards(getElements(els, start, end), cardActions).map((el) => <td key={el.key}>{el}</td>)}</tr>
}

/**@param {Dict[]} elements*/
export default function Grid({ elements: e, cardActions }) {
    const sblock = <table>
        <tbody>
        {createRow(e, 1, 1, cardActions)}
        {createRow(e, 3, 4, cardActions)}
        {createRow(e, 11, 12, cardActions)}
        {createRow(e, 19, 20, cardActions)}
        {createRow(e, 37, 38, cardActions)}
        {createRow(e, 55, 56, cardActions)}
        {createRow(e, 87, 88, cardActions)}
        </tbody>
    </table>

    const dblock = <table>
        <tbody>
        {createRow(e, 21, 30, cardActions)}
        {createRow(e, 39, 48, cardActions)}
        {createRow(e, 71, 80, cardActions)}
        {createRow(e, 103, 112, cardActions)}
        </tbody>
    </table>

    const pblock = <table>
        <tbody>
        <tr>
            <td colSpan='5'></td>
            {cards(getElements(e, 2, 2), cardActions).map((el) => <td key={el.key}>{el}</td>)}
        </tr>
        {createRow(e, 5, 10, cardActions)}
        {createRow(e, 13, 18, cardActions)}
        {createRow(e, 31, 36, cardActions)}
        {createRow(e, 49, 54, cardActions)}
        {createRow(e, 81, 86, cardActions)}
        {createRow(e, 113, 118, cardActions)}
        </tbody>
    </table>

    const fblock = <table>
        <tbody>
        {createRow(e, 57, 70, cardActions)}
        {createRow(e, 89, 102, cardActions)}
        </tbody>
    </table>

    const out = <div>
        <div className='row'>
            <div className='column'>
                {sblock}
            </div>
            <div className='column'>
                {dblock}
            </div>
            <div className='column'>
                {pblock}
            </div>
        </div>
        <div className='row'>
            <div className='column'>
                {fblock}
            </div>
        </div>
    </div>

    try { return out }
    catch (e) { console.error(e) }
    //Error handling isn't really good here
}