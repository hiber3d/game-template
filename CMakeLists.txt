cmake_minimum_required(VERSION 3.11 FATAL_ERROR)


project("GameTemplate" LANGUAGES CXX C)
set(CMAKE_C_STANDARD 11)
set(CMAKE_CXX_STANDARD 20)
set(TARGET_NAME "GameTemplate")

include(FetchContent)
FetchContent_Declare(
    Hiber3D_zip
    DOWNLOAD_EXTRACT_TIMESTAMP false
    URL https://cdn.hiberworld.com/hiber2/web/stable/v0.114.0/Hiber3D_v0.114.0.zip
)
FetchContent_MakeAvailable(Hiber3D_zip)

# set(HBR_ENABLE_SOKOL_ASSERTS false CACHE BOOL "" FORCE) # Runs way faster without sokol asserts
# include(FetchContent)
# FetchContent_Declare(Hiber2
#     GIT_REPOSITORY  https://github.com/HiberWorld/Hiber2.git
#     GIT_TAG         master)
# FetchContent_MakeAvailable(Hiber2)

# Executable (Desktop for IDE auto-complete + Emscripten for web build)
set(GAME_FILES
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Main.cpp
    
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Example/ExampleEvents.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Example/ExampleModule.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Example/ExampleModule.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Example/ExampleTypes.hpp
)

hiber3d_add_game(GameTemplate "${GAME_FILES}")
target_include_directories(GameTemplate PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/game)

if(DEFINED EMSCRIPTEN)
    hiber3d_game_add_interop(GameTemplate)
endif()
