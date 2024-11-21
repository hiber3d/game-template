cmake_minimum_required(VERSION 3.11 FATAL_ERROR)
set(GAME_NAME "GameTemplate")
set(GAME_NAME_WEBGL "${GAME_NAME}_webgl")
set(GAME_NAME_WEBGPU "${GAME_NAME}_webgpu")
set(GAME_NAME_WEBGPU "${GAME_NAME}_tests")
project(${GAME_NAME} LANGUAGES CXX C)

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

# Get Hiber3D library
option(HBR_USE_WEBGPU "Use WebGPU version of the library" ON)

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

# Game executable (Desktop for IDE auto-complete + Emscripten for web build)
set(GAME_FILES
    ${CMAKE_CURRENT_SOURCE_DIR}/src/Defines.hpp

    ${CMAKE_CURRENT_SOURCE_DIR}/src/generated/EventModule.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/Modules/ExampleModule.hpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/Modules/ExampleModule.cpp

    ${CMAKE_CURRENT_SOURCE_DIR}/src/Main.cpp
)

add_executable(${GAME_NAME_WEBGL} ${GAME_FILES})
target_link_libraries(${GAME_NAME_WEBGL} Hiber3D)
target_include_directories(${GAME_NAME_WEBGL} PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/src)

add_executable(${GAME_NAME_WEBGPU} ${GAME_FILES})
target_link_libraries(${GAME_NAME_WEBGPU} Hiber3D)
target_include_directories(${GAME_NAME_WEBGPU} PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/src)
target_compile_definitions(${GAME_NAME_WEBGPU} PRIVATE HBR_USE_WEBGPU)

if(DEFINED EMSCRIPTEN)
    # Generate event bindings from event *.hpp-files
    hiber3d_target_get_essential_include_dirs(${GAME_NAME_WEBGL} GAME_ESSENTIAL_INCLUDE_DIRS)

    set(GAME_EVENT_FILES
      ${CMAKE_CURRENT_SOURCE_DIR}/src/modules/camera_module/CameraEvents.hpp
    )

    add_custom_command(
      OUTPUT ${CMAKE_CURRENT_BINARY_DIR}/interop_ast.json
      DEPENDS ${GAME_EVENT_FILES} ${CMAKE_CURRENT_SOURCE_DIR}/scripts/generate-events.js ${CMAKE_CURRENT_SOURCE_DIR}/scripts/filter.jq
      COMMAND clang
        -std=c++20
        -DHBR_EMSCRIPTEN
        ${GAME_ESSENTIAL_INCLUDE_DIRS}
        -Xclang -ast-dump=json -fsyntax-only
        ${GAME_EVENT_FILES}
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

    setup_emscripten_target(${GAME_NAME_WEBGL} ${GAME_OUTPUT_NAME_WEBGL})
    setup_emscripten_target(${GAME_NAME_WEBGPU} ${GAME_OUTPUT_NAME_WEBGPU})

    configure_file(${CMAKE_CURRENT_SOURCE_DIR}/prebuilt/package.json ${CMAKE_BINARY_DIR}/package.json @ONLY)
    configure_file(${CMAKE_CURRENT_SOURCE_DIR}/prebuilt/index.js ${CMAKE_BINARY_DIR}/index.js @ONLY)
    configure_file(${CMAKE_CURRENT_SOURCE_DIR}/prebuilt/index.d.ts ${CMAKE_BINARY_DIR}/index.d.ts @ONLY)
    configure_file(${CMAKE_CURRENT_SOURCE_DIR}/prebuilt/test.html ${CMAKE_BINARY_DIR}/test.html @ONLY)
endif()

# Tests
enable_testing()

add_executable(${GAME_NAME_TESTS}
    ${CMAKE_CURRENT_SOURCE_DIR}/test/TestMain.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/test/TestUtils.hpp
    ${GAME_FILES})
target_include_directories(${GAME_NAME_TESTS} PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/src)
target_link_libraries(${GAME_NAME_TESTS}
    gtest
    gmock
    Hiber3D
)
include(GoogleTest)
target_compile_definitions(${GAME_NAME_TESTS} PRIVATE HIBER3D_TEST)

if(NOT EMSCRIPTEN)
    gtest_discover_tests(${GAME_NAME_TESTS} DISCOVERY_MODE PRE_TEST)
endif()
