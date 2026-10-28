import { useState, useEffect } from 'react'
import Card from './Card'
import FavouriteButton from './FavouriteButton'
import FavouritesPage from './FavouritesPage'
import useFavourites from './hooks/useFavourites'

/**@param {Dict[]} elements */
function cards(elements) {
    const { favourites, isFavourite, toggleFavourite } = useFavourites();
    return elements.map((element) => <Card
        key={element.number}
        element={element}
        onClick={() => setCurrentElement(element)}
        isFavourite={isFavourite(element.number)}
        onToggleFavourite={toggleFavourite}
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

function createRow(els, start, end) {
    return <tr>{cards(getElements(els, start, end)).map((el) => <td>{el}</td>)}</tr>
}

/**@param {Dict[]} elements*/
export default function Grid(e) {
    const sblock = <table>
        {createRow(e, 1, 1)}
        {createRow(e, 3, 4)}
        {createRow(e, 11, 12)}
        {createRow(e, 19, 20)}
        {createRow(e, 37, 38)}
        {createRow(e, 55, 56)}
        {createRow(e, 87, 88)}
    </table>

    const dblock = <table>
        {createRow(e, 21, 30)}
        {createRow(e, 39, 48)}
        {createRow(e, 71, 80)}
        {createRow(e, 103, 112)}
    </table>

    const pblock = <table>
        <tr>
            <td colspan='5'></td>
            {cards(getElements(e, 2, 2)).map((el) => <td>{el}</td>)}
        </tr>
        {createRow(e, 5, 10)}
        {createRow(e, 13, 18)}
        {createRow(e, 31, 36)}
        {createRow(e, 49, 54)}
        {createRow(e, 81, 86)}
        {createRow(e, 113, 118)}
    </table>

    const fblock = <table>
        {createRow(e, 57, 70)}
        {createRow(e, 89, 102)}
    </table>

    const out = <div className='grid'>
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