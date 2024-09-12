import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: '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'
});

async function generateTestCases() {
    try {
        const prompt = `
        Generate functional test cases for the following web project:

        **Project Overview:**
        The "Test Genie Calculators" website includes a "Loan EMI" tab with the following features:
        1. Input fields for:
        - Loan amount (in rupees)
        - Rate of interest (per annum)
        - Loan tenure (in years)
        2. A "Calculate EMI" button that triggers the EMI calculation.

        After clicking the "Calculate EMI" button:
        - The following details are updated:
        - Monthly EMI
        - Principal Amount
        - Total Interest
        - Total Amount
        - A pie chart is displayed showing:
        - Principal Amount
        - Interest Amount

        **Requirements:**
        Generate test cases covering the following categories:
        1. **Positive Flow Test Cases:** Test cases that verify the correct functionality with valid input data.
        2. **Negative Flow Test Cases:** Test cases that verify how the system handles invalid or unexpected input data.
        3. **Edge Test Cases:** Test cases that check the system's behavior with boundary values or extreme data.
        4. **Risk-Based Test Cases:** Test cases that assess high-risk areas, such as calculations or critical functionalities.

        **Test Case Format:**
        Output the test cases in a tabular format with the following columns:
        - **Test Case ID**
        - **Test Description**
        - **Precondition**
        - **Steps**
        - **Expected Result**

        Ensure that there are no duplicate test cases and format the output clearly as follows:

        1. Positive Flow Test Cases
        2. Negative Flow Test Cases
        3. Edge Test Cases
        4. Risk-Based Test Cases
        `;

        console.log(prompt);


        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'user', content: prompt }
            ],
            max_tokens: 1500,
        });

        // Check if response and choices are defined
        if (response && response.choices && response.choices.length > 0) {
            console.log(response.choices[0].message.content);
        } else {
            console.error("Unexpected response format:", response);
        }
    } catch (error) {
        console.error("Error generating test cases:", error);
    }
}

generateTestCases();
