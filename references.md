# References

## Board Logic
[Board generation was based on Ania Kubów's video "Build your own CANDY CRUSH using JavaScript, HTML and CSS | Ania Kubow"](https://www.youtube.com/watch?v=XD5sZWxwJUk)

## DocumentFragment
[DocumentFragment was used to append square to squares before moving the entire array into the container](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment/append)

## Boundary and axis check

Manhattan Distance is the principle used in the boundary and axis check. It is the absolute distance between two points in a grid-like path.

Considering this, we just need to know the boundaries in which the match-3 game’s swap functions are allowed to operate in. These boundaries are orthogonally adjacent tiles (one tile in cardinal directions). 

Using Stack Overflow user, Ryan Peschel’s example:
```
// Source - https://stackoverflow.com/q/66616376
// Posted by Ryan Peschel, modified by community. See post 'Timeline' for change history
// Retrieved 2026-03-02, License - CC BY-SA 4.0

let aX = Math.floor(idx1 % width);
let aY = Math.floor(idx1 / width);

let bX = Math.floor(idx2 % width);
let bY = Math.floor(idx2 / width);

return Math.abs(aX - bX) + Math.abs(aY - bY);
```
We can adapt it to check axis and boundary as seen in app.js:

```
const bounds = (id1,id2,boardSize) => { 

    const row1 = Math.floor(id1 / boardSize);
    const row2 = Math.floor(id2 / boardSize);
    const col1 = id1 % boardSize;
    const col2 = id2 % boardSize;
  
    const isVerticallyAdjacent = col1 === col2 && Math.abs(row1 - row2) === 1;
    const isHorizontallyAdjacent = row1 === row2 && Math.abs(col1 - col2) === 1;
    return isVerticallyAdjacent || isHorizontallyAdjacent;
}
```
1. col1 & col2 checks the row. By using %, the remainder signifies the row the swap is being made in.
2. row1 and row2 checks the column by using math.floor, we get an integer signifying the column the swap is being made in.
3. If col1 & col2 are equal, this means that the swap is being made vertically.
4. If row1 & row2 are equal, this means the swap is being made horizontally.
5. To ensure the swaps are made to adjacent tiles, we have to limit the absolute distance between tiles to 1. That is what Math.abs(row1 -  row2) === 1 (checks for vertically adjacent tiles) and Math.abs(col1 - col2) === 1 (checks for horizontally adjacent tiles) are for.
6. The function then returns a boolean.


- [Data Camp - Manattan Distance](https://www.datacamp.com/tutorial/manhattan-distance)
- [Ryan Perschel's question on Stack Overflow](https://stackoverflow.com/questions/66616376/how-to-find-manhattan-distance-in-one-dimensional-array)


