*** Settings ***
Documentation    Test cases for duck-ai snap
Resource         kvm.resource


*** Test Cases ***
Duck AI Launches And Renders
    [Documentation]    Verify duck-ai snap launches and renders a UI on Mir
    [Tags]    smoke    yarf:certification_status: blocker
    Log Screenshot
