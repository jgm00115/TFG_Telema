#include <SDL2/SDL.h>
#include <iostream>
#include <vector>

int main(int argc, char* argv[]) {
    if (SDL_Init(SDL_INIT_VIDEO) < 0) {
        std::cerr << "Failed to initialize SDL: " << SDL_GetError() << std::endl;
        return 1;
    }

    SDL_Window* window = SDL_CreateWindow(
        "Resizable Drawing Canvas",
        SDL_WINDOWPOS_CENTERED,
        SDL_WINDOWPOS_CENTERED,
        800, 600,
        SDL_WINDOW_SHOWN | SDL_WINDOW_RESIZABLE
    );

    if (!window) {
        std::cerr << "Failed to create window: " << SDL_GetError() << std::endl;
        SDL_Quit();
        return 1;
    }

    SDL_Renderer* renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED);
    if (!renderer) {
        std::cerr << "Failed to create renderer: " << SDL_GetError() << std::endl;
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    // Store points for persistent drawing
    std::vector<SDL_Point> points;

    bool running = true;
    bool isDrawing = false;
    SDL_Event event;

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_QUIT) {
                running = false;
            } else if (event.type == SDL_WINDOWEVENT) {
                if (event.window.event == SDL_WINDOWEVENT_RESIZED) {
                    int newWidth = event.window.data1;
                    int newHeight = event.window.data2;
                    SDL_RenderSetLogicalSize(renderer, newWidth, newHeight);
                    std::cout << "Window resized to " << newWidth << "x" << newHeight << std::endl;
                }
            } else if (event.type == SDL_MOUSEBUTTONDOWN) {
                if (event.button.button == SDL_BUTTON_LEFT) {
                    isDrawing = true;
                }
            } else if (event.type == SDL_MOUSEBUTTONUP) {
                if (event.button.button == SDL_BUTTON_LEFT) {
                    isDrawing = false;
                }
            } else if (event.type == SDL_MOUSEMOTION) {
                if (isDrawing) {
                    SDL_Point newPoint = { event.motion.x, event.motion.y };
                    points.push_back(newPoint);
                }
            }
        }

        // Clear the screen
        SDL_SetRenderDrawColor(renderer, 255, 255, 255, 255);
        SDL_RenderClear(renderer);

        // Draw the points
        SDL_SetRenderDrawColor(renderer, 0, 0, 0, 255);
        for (const auto& point : points) {
            SDL_RenderDrawPoint(renderer, point.x, point.y);
        }

        // Present the rendered frame
        SDL_RenderPresent(renderer);
    }

    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();

    return 0;
}