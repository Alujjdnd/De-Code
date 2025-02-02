import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

import skillsData from "@/app/resc/skills.json" assert { type: "json" };
import interestsData from "@/app/resc/interests.json" assert { type: "json" };

const SKILLS = skillsData.SKILLS;
const INTERESTS = interestsData.INTERESTS;

const anthropic = new Anthropic({
    apiKey: process.env.NEXT_PUBLIC_CLAUDE_API_KEY!, // Ensure you set this in your .env file
});

export async function POST(req: NextRequest) {
    try {
        const { categories } = await req.json();
        if (!categories || !Array.isArray(categories)) {
            return NextResponse.json({ error: 'Categories must be an array' }, { status: 400 });
        }

        const prompt = `
        Given the following user-selected categories: ${categories.join(', ')}, match them against each theme with a percentage match and the matched skills.

        Then, for each category, give 2-3 project suggestions that match the user's interests.
        
        Sort the projects by match percentage in descending order.

        Use the predefined skills:
        ${JSON.stringify(SKILLS, null, 2)}

        And predefined interests:
        ${JSON.stringify(INTERESTS, null, 2)}

        Generate a response in clean HTML format. Structure it as:

        <div>
            <h1>Category Name</h1>
            <p>Match: 90%</p>
            <p>Skills: Skill 1, Skill 2, Skill 3</p>
            <h2>Projects</h2>
            <ul>
                <li>Project 1</li>
                <li>Project 2</li>
        </ul>

        Do not return anything other than HTML.
        `;

        const response = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 2048,
            messages: [{ role: 'user', content: prompt }],
        });

        if (!response || !response.content || !Array.isArray(response.content)) {
            throw new Error("Unexpected response format from Claude");
        }

        const responseContent = response.content.map((msg: any) => msg.text).join("\n");

        return new Response(responseContent, {
            headers: { "Content-Type": "text/html" },
        });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            details: error.message || 'Unknown error',
        }, { status: 500 });
    }
}
