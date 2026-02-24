# Match-3 - Core mechanics only

## MVP
- Game board with size option for difficulty scaling. (Generates game boards of different sizes)
- Generates randomly placed tiles. 
- Select and swap selected tiles.
- Check for matches of 3 or more and remove matched tiles. If no matches are found, reduce move/turn count by 1 and return swapped tiles to their original positions. 
- Drops randomly generated tiles into the empty spaces.
- Include manual shuffle.
- Counts score up to a goal which triggers a `Victory` condition
- Counts moves/turns down from a set limit triggering a `Game Over` condition if the the count reaches `0`.

## User Stories
As a user, I want to:
1. See a starting page where I am able to select the size of the board and the number of different tiles.
2. See a grid with randomized tiles.
3. Click on two adjacent tiles and swap their positions. 
4. Clearly see the tiles I have selected.
5. See 3 or more matched tiles in rows and/or columns disappear while adding to my total points.
6. See random tiles to fall from the top of the grid to fill any empty spaces left behind by matched tiles.
7. See chain reactions caused by the falling tiles that create matches of 3 or more.
8. See my total points and points required for a victory condition.
9. See my remaining moves.
10. Be able to shuffle the board.
11. See a “Victory” screen if I clear the stage by reaching a specified point requirement.
12. See a “Game Over” screen if I run out of moves.
13. Be able to restart the game from the “Victory”, “Game Over” and game screens by clicking a restart button.
14. See tiles go back to their original positions if the swapped tiles do not result in 3 or more matching tiles.


## Lo-fi Wireframes
### Normal Game loop
**Normal gameplay loop:** Select board size > Select number of pieces > swap 2 tiles and check for a match 3 (or more) condition, clearing matched tiles > random tiles fall down from above to fill the space > chained matches cause more tiles to disappear > more random tiles fall from above to fill the space. > repeat until victory or game over condition is met.

Select Board Size

![An image of the title screen showing three board size options.](/img/1-Select-Board-Size.png)

Select number of tiles

![An image of the second screen showing the board size selected and three options for selecting number of tile types.](/img/2-Select-number-of-tiles.png)

GAME START

![An image of the initialized game board.](/img/3-GAME-START.png)

Swap 2 tiles to match 3 - tiles disappear

![An image of tiles swapped resulting in a match of 3 tiles. Matched tiles are removed.](/img/4-Swap-2-tiles-to-match-3-tiles-disappear.png)

Chain into a match 4 condition (top tiles move down into empty spaces)
![An image of of a chained match condition resulting in a match of 4.](/img/5. Chain into a match 4 condition (top tiles move down into empty spaces))

Match 4 - tiles disappear

![An image of the 4 matched tiles being removed.](/img/6-Match-4-tiles-disappear.png)

New tiles come in from above and fill empty spaces
![An image of new random tiles coming into frame from above, filling the empty spaces.](/img/7-New-tiles-come-in-from-above-and-fill-empty-spaces.png)


### Victory Condition

![An image of the Victory screen](/img/8-Victory-condition.png)


### Game Over Condition

![An image of the Game Over screen](/img/8a-Game-over-condition-met.png)


### Mismatch Condition
**Mismatch condition met:** tiles are swapped back to their original positions.
Mismatch

![An image of swapped tiles resulting in a mismatch and reduced turn count.](/img/4a-Mismatch.png)

Return tiles to original positions

![An image of swapped tiles returning to their original positions.](/img/4a.1-Return-tiles-to-original-positions.png)

## References 

