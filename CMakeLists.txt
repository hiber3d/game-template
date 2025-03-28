cmake_minimum_required(VERSION 3.11 FATAL_ERROR)


project("GameTemplate" LANGUAGES CXX C)
set(CMAKE_C_STANDARD 11)
set(CMAKE_CXX_STANDARD 20)
set(TARGET_NAME "GameTemplate")

include(FetchContent)
FetchContent_Declare(
    Hiber3D_zip
    DOWNLOAD_EXTRACT_TIMESTAMP false
    URL https://cdn.hiber3d.com/engine/web/dev/Hiber3D_v1.104.0-dev.zip
)
FetchContent_MakeAvailable(Hiber3D_zip)

# Executable (Desktop for IDE auto-complete + Emscripten for web build)
set(GAME_FILES
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Main.cpp
    
    
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Gun/GunEvents.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Gun/GunModule.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Gun/GunModule.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Gun/GunTypes.hpp
    
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Example/ExampleEvents.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Example/ExampleModule.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Example/ExampleModule.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/game/Example/ExampleTypes.hpp
)

hiber3d_add_game(GameTemplate "${GAME_FILES}")
hiber3d_game_include_directories(GameTemplate ${CMAKE_CURRENT_SOURCE_DIR}/game)

if(DEFINED EMSCRIPTEN)
    hiber3d_game_add_interop(GameTemplate)
endif()
