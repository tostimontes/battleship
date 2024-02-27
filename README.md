# Battleship

## Overview

This Battleship game is a part of the JavaScript curriculum at [The Odin Project](https://www.theodinproject.com/). It's a web-based implementation of the classic strategy game where two players place a fleet of ships on a grid and take turns to attack each other's fleet. The aim is to sink all of the opponent's ships. The game features both single-player (against an AI) and two-player modes.

## Features

- **Single-Player & Two-Player Modes**: Choose to play against a smart AI opponent or against another player.
- **Drag-and-Drop Ship Placement**: Interactively place ships on the grid using a drag-and-drop interface.
- **Visually engaging UI**: I opted for a pixelated style game. Ships, background image and animations have been created from AI generated images.

## Technical Highlights

- **Asynchronous JavaScript**: The game extensively uses asynchronous functions to handle events like ship placement, AI attacks, and dialog prompts, providing a smooth and responsive user experience.
- **Smart AI Opponent**: The AI, while not completely smart, is designed to continue shooting at adjacent tiles once it registers a hit.
- **Modular Design**: The game's logic is divided into modules (e.g., game logic, UI, controller).
- **MVC Model**: This project represented my initial foray into utilizing the Model-View-Controller (MVC) architectural pattern. The MVC model significantly contributed to a well-organized codebase, where the game's data (Model), user interface (View), and the control flow (Controller) were distinctly separated. This separation not only simplified the debugging process but also allowed for more manageable updates and scalability of the application.

## Usage

Feel free to play the game at [Battleship](https://tostimontes.github.io/battleship/), by [_tostimontes_](https://github.com/tostimontes/) ![Battleship, by tostimontes](./media/usage-example.gif)

## Potential Improvements

- **Responsiveness**: Enhancing the game's layout and design to be responsive and adaptable to different screen sizes and devices.
- **Rotation Functionality**: Addressing the issue where ship rotation does not work correctly after the first game iteration.
- **Enhanced AI**: Further refining the AI's logic for discarding potentially empty targets.
- **Complex Test Cases**: This project marks my first foray into implementing testing from the start. The unit tests cover key functionalities like ship placement, attack handling, and utility functions. However, I aim to enhance the testing suite to cover more complex parts of the code and ensure robustness, like integration or end-to-end testing.

## Known Issues

- **Rotation Bug**: Currently, the rotation of ships does not work in games subsequent to the first one. This issue needs further investigation and fixing.
