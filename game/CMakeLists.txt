cmake_minimum_required(VERSION 3.11 FATAL_ERROR)
set(PROJECT_NAME "GameTemplate")
project(${PROJECT_NAME} LANGUAGES CXX C)
option(HBR_USE_WEBGPU "Use WebGPU version of the library" ON)

# Necessary setup
# TODO: Move setup into CMake macro in Hiber2 repo
set(CMAKE_C_STANDARD 11)
set(CMAKE_CXX_STANDARD 20)

set(CMAKE_OBJECT_PATH_MAX 250)

set(CMAKE_C_USE_RESPONSE_FILE_FOR_OBJECTS 1)
set(CMAKE_CXX_USE_RESPONSE_FILE_FOR_OBJECTS 1)

set(CMAKE_C_RESPONSE_FILE_LINK_FLAG "@")
set(CMAKE_CXX_RESPONSE_FILE_LINK_FLAG "@")

set(CMAKE_NINJA_FORCE_RESPONSE_FILE 1 CACHE INTERNAL "")

include(FetchContent)

if(DEFINED ENV{GITHUB_ACTION})
  set(GIT_REPO https://HiberBot:$ENV{GH_PAT}@github.com/HiberWorld/Hiber2)
else()
  set(GIT_REPO https://github.com/HiberWorld/Hiber2.git)
endif()

# FetchContent_Declare(Hiber2
#     GIT_REPOSITORY  ${GIT_REPO}
#     GIT_TAG         benji/scene)
# FetchContent_MakeAvailable(Hiber2)

FetchContent_Declare(
    Hiber3D_zip
    DOWNLOAD_EXTRACT_TIMESTAMP TRUE
    URL https://cdn.hiber3d.com/engine/web/dev/Hiber3D_v1.80.0-dev.zip
    # URL https://storage.googleapis.com/bkt-hiberworld-cdn-prod/hiber2/web/hiberik-new-skin/v1.80.0-hiberik-new-skin/Hiber3D_v1.80.0-hiberik-new-skin.0%2Baaf122171.zip
)
FetchContent_MakeAvailable(Hiber3D_zip)

set(GAME_OUTPUT_NAME_WEBGL "RPG_webgl")
set(GAME_OUTPUT_NAME_WEBGPU "RPG_webgpu")

# GAME executable (Desktop for IDE auto-complete + Emscripten for web build)
set(GAME_FILES        
    ${CMAKE_CURRENT_SOURCE_DIR}/src/Defines.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/generated/EventModule.cpp
    
    ${CMAKE_CURRENT_SOURCE_DIR}/src/Modules/ExampleModule.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/Modules/ExampleModule.cpp

    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/GameplayModule.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/GameplayModule.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/GameplayUiEvents.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/act_1_module/Act1Defines.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/act_1_module/Act1DialogueTriggerPrefabs.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/act_1_module/Act1Items.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/act_1_module/Act1Module.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/act_1_module/Act1Module.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/act_1_module/Act1Npcs.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/act_1_module/Act1QuestFlags.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/gameplay_debug_module/GameplayDebugEvents.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/gameplay_debug_module/GameplayDebugModule.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/gameplay_debug_module/GameplayDebugModule.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/dialogue_module/DialogueEvents.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/dialogue_module/DialogueModule.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/dialogue_module/DialogueModule.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/dialogue_module/DialogueTrigger.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/dialogue_module/DialogueTriggerPrefab.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/items_module/Items.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/items_module/ItemsEvents.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/items_module/ItemsModule.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/items_module/ItemsModule.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/player_avatar_module/PlayerAvatar.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/player_avatar_module/PlayerAvatarEvents.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/player_avatar_module/PlayerAvatarModule.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/player_avatar_module/PlayerAvatarModule.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/player_avatar_module/player_renderable_module/PlayerRenderableEvents.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/player_avatar_module/player_renderable_module/PlayerRenderableModule.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/player_avatar_module/player_renderable_module/PlayerRenderableModule.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/player_avatar_module/player_transform_module/PlayerTransformEvents.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/player_avatar_module/player_transform_module/PlayerTransformModule.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/player_avatar_module/player_transform_module/PlayerTransformModule.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/player_avatar_module/player_transform_module/SceneColliders.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/quests_module/Quests.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/quests_module/QuestsEvents.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/quests_module/QuestsModule.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/quests_module/QuestsModule.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/quests_module/QuestsNpc.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/save_state_module/SaveState.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/save_state_module/SaveStateEvents.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/save_state_module/SaveStateModule.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/save_state_module/SaveStateModule.hpp

    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/performance_module/PerformanceModule.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/performance_module/PerformanceModule.cpp

    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/screen_state_module/ScreenState.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/screen_state_module/ScreenStateEvents.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/screen_state_module/ScreenStateModule.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/screen_state_module/ScreenStateModule.cpp

    ${CMAKE_CURRENT_SOURCE_DIR}/src/utils/Rng.hpp
)

add_executable(RPG_webgl 
    ${CMAKE_CURRENT_SOURCE_DIR}/src/Main.cpp
    ${GAME_FILES})
target_link_libraries(RPG_webgl Hiber3D)
target_include_directories(RPG_webgl PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/src)
    
add_executable(RPG_webgpu 
    ${CMAKE_CURRENT_SOURCE_DIR}/src/Main.cpp
    ${GAME_FILES})
target_link_libraries(RPG_webgpu Hiber3D)
target_include_directories(RPG_webgpu PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/src)
target_compile_definitions(RPG_webgpu PRIVATE HBR_USE_WEBGPU)

if(DEFINED EMSCRIPTEN)
    # Generate event bindings from event *.hpp-files
    hiber3d_target_get_essential_include_dirs(RPG_webgl GAME_ESSENTIAL_INCLUDE_DIRS)

    set(GAME_EVENT_DEFINITIONS
      ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/camera_module/CameraEvents.hpp

      ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/GameplayUiEvents.hpp
      ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/gameplay_debug_module/GameplayDebugEvents.hpp
      ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/dialogue_module/DialogueEvents.hpp
      ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/items_module/ItemsEvents.hpp
      ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/player_avatar_module/PlayerAvatarEvents.hpp
      ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/player_avatar_module/player_renderable_module/PlayerRenderableEvents.hpp
      ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/player_avatar_module/player_transform_module/PlayerTransformEvents.hpp
      ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/quests_module/QuestsEvents.hpp
      ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/gameplay_module/save_state_module/SaveStateEvents.hpp

      ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/performance_module/PerformanceEvents.hpp

      ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/screen_state_module/ScreenStateEvents.hpp
    )

    add_custom_command(
      OUTPUT ${CMAKE_CURRENT_BINARY_DIR}/interop_ast.json
      DEPENDS ${GAME_EVENT_DEFINITIONS} ${CMAKE_CURRENT_SOURCE_DIR}/scripts/generate-events.js ${CMAKE_CURRENT_SOURCE_DIR}/scripts/filter.jq
      COMMAND clang
        -std=c++20
        -DHBR_EMSCRIPTEN
        ${GAME_ESSENTIAL_INCLUDE_DIRS}
        -Xclang -ast-dump=json -fsyntax-only
        ${GAME_EVENT_DEFINITIONS}
        | jq -s -f ${CMAKE_CURRENT_SOURCE_DIR}/scripts/filter.jq > ${CMAKE_CURRENT_BINARY_DIR}/interop_ast.json 
      )
    
    add_custom_command(
      OUTPUT
        ${CMAKE_CURRENT_SOURCE_DIR}/src/generated/EventModule.cpp
        ${CMAKE_CURRENT_SOURCE_DIR}/src/generated/EventBindings.cpp
        ${CMAKE_CURRENT_SOURCE_DIR}/src/generated/EventComponents.hpp
        ${CMAKE_CURRENT_SOURCE_DIR}/src/generated/EventModule.hpp
      DEPENDS ${CMAKE_CURRENT_BINARY_DIR}/interop_ast.json
      COMMAND node ${CMAKE_CURRENT_SOURCE_DIR}/scripts/generate-events.js ${CMAKE_CURRENT_BINARY_DIR}/interop_ast.json ${CMAKE_CURRENT_SOURCE_DIR}/src/generated
    )

    # Function to set up Emscripten-specific options
    function(setup_emscripten_target TARGET OUTPUT_NAME)
        # Embind-specific *.cpp-files need to be compiled outside of CMake using this function
        hiber3d_target_bindings(${TARGET}
            ${CMAKE_CURRENT_SOURCE_DIR}/src/generated/EventBindings.cpp
        )

        target_link_options(${TARGET} PUBLIC 
            -sEXPORTED_FUNCTIONS=['_main','stackAlloc'] 
            -sEXPORTED_RUNTIME_METHODS=['ccall'] 
            -sMODULARIZE=1 
            -sEXPORT_ES6=1
            -sUSE_ES6_IMPORT_META=1 
            --emit-tsd ${OUTPUT_NAME}.d.ts
            -o ${OUTPUT_NAME}.js
        )

        set_target_properties(${TARGET} PROPERTIES OUTPUT_NAME ${OUTPUT_NAME})
    endfunction()

    setup_emscripten_target(RPG_webgl ${GAME_OUTPUT_NAME_WEBGL})
    setup_emscripten_target(RPG_webgpu ${GAME_OUTPUT_NAME_WEBGPU})

    configure_file(${CMAKE_CURRENT_SOURCE_DIR}/prebuilt/package.json ${CMAKE_BINARY_DIR}/package.json @ONLY)
    configure_file(${CMAKE_CURRENT_SOURCE_DIR}/prebuilt/index.js ${CMAKE_BINARY_DIR}/index.js @ONLY)
    configure_file(${CMAKE_CURRENT_SOURCE_DIR}/prebuilt/index.d.ts ${CMAKE_BINARY_DIR}/index.d.ts @ONLY)
    configure_file(${CMAKE_CURRENT_SOURCE_DIR}/prebuilt/test.html ${CMAKE_BINARY_DIR}/test.html @ONLY)
endif()

# Tests
enable_testing()

add_executable(RPGTests 
    ${CMAKE_CURRENT_SOURCE_DIR}/test/TestMain.cpp 
    ${CMAKE_CURRENT_SOURCE_DIR}/test/TestUtils.hpp 
    ${GAME_FILES})

target_include_directories(RPGTests PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/src)
target_link_libraries(RPGTests
    gtest
    gmock
    Hiber3D
)
include(GoogleTest)
target_compile_definitions(RPGTests PRIVATE HIBER3D_TEST)

if(NOT EMSCRIPTEN)
    gtest_discover_tests(RPGTests DISCOVERY_MODE PRE_TEST)
endif()
