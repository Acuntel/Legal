import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  try {
    const { email, password, name, firmName } = await req.json();

    if (!email || !password || !name || !firmName) {
      return Response.json({ error: "All fields required" }, { status: 400 });
    }

    if (password.length < 8) {
      return Response.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return Response.json({ error: "Email already in use" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const slug = firmName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const firm = await prisma.firm.create({
      data: {
        name: firmName,
        slug: `${slug}-${uuid().slice(0, 6)}`,
        apiKey: `lgl_${uuid().replace(/-/g, "")}`,
        intakeConfigs: {
          create: {
            name: "Default",
            systemPrompt:
              "Focus on personal injury cases. Be empathetic and thorough in gathering incident details.",
            serviceOptions: [
              "Car Accident",
              "Truck Accident",
              "Slip and Fall",
              "Medical Malpractice",
              "Workers Compensation",
              "Wrongful Death",
              "Other",
            ],
          },
        },
        caseTemplates: {
          create: {
            name: "Auto Accident",
            caseType: "auto_accident",
            description: "Motor vehicle accident intake template",
            questions: [
              {
                question: "When did the accident happen?",
                type: "date",
                required: true,
                weight: 10,
              },
              {
                question: "Where did the accident occur?",
                type: "text",
                required: true,
                weight: 5,
              },
              {
                question: "Were you the driver, passenger, or pedestrian?",
                type: "select",
                required: true,
                options: ["Driver", "Passenger", "Pedestrian", "Cyclist"],
                weight: 5,
              },
              {
                question: "Was a police report filed?",
                type: "boolean",
                required: false,
                weight: 10,
              },
              {
                question: "What injuries did you sustain?",
                type: "text",
                required: true,
                weight: 20,
              },
              {
                question: "Have you received medical treatment?",
                type: "boolean",
                required: true,
                weight: 15,
              },
              {
                question: "Do you know if the other driver had insurance?",
                type: "select",
                required: false,
                options: ["Yes", "No", "Not sure"],
                weight: 10,
              },
            ],
            scoringRules: [
              {
                field: "policeReport",
                condition: "true",
                score: 10,
                flag: "documented_incident",
              },
              {
                field: "medicalTreatment",
                condition: "true",
                score: 15,
                flag: "documented_treatment",
              },
              {
                field: "otherInsurance",
                condition: "Yes",
                score: 10,
                flag: "insured_defendant",
              },
            ],
            redFlags: [
              "statute_expired",
              "no_treatment",
              "no_injury",
              "client_at_fault",
            ],
            greenFlags: [
              "clear_liability",
              "severe_injury",
              "insured_defendant",
              "police_report",
              "witnesses",
            ],
          },
        },
      },
    });

    await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: "OWNER",
        firmId: firm.id,
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Signup error:", error);
    return Response.json(
      { error: "Failed to create account" },
      { status: 500 },
    );
  }
}
