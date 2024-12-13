import { Job } from "../components/job/job.type";
import * as lzString from "lz-string";
import { Resume } from "../components/resume/resume.type";
import { ResumeMatch } from "../ResumeMatch.type";

const jobDescription1 = `Job Summary
Welding Inc is seeking a skilled and safety-conscious Welder to join our team in Virginia. The ideal candidate will have experience in MIG, TIG, Stick, and Flux Core Welding and a proven ability to fabricate, assemble, and repair metal structures and equipment. This role requires attention to detail, technical expertise, and a commitment to producing high-quality work that meets industry and company standards.

Key Responsibilities
Perform welding operations using MIG, TIG, Stick, and Flux Core Welding methods on various materials such as steel, aluminum, and stainless steel.
Read and interpret blueprints, technical drawings, and schematics to execute precise welding tasks.
Assemble and weld components accurately, ensuring structural integrity and adherence to project specifications.
Inspect and test welds for strength and durability, addressing any defects or imperfections.
Prepare materials for welding by cutting, grinding, or cleaning surfaces to remove impurities.
Maintain and calibrate welding equipment, tools, and machinery to ensure optimal performance.
Adhere to all safety guidelines and protocols, including wearing protective gear and maintaining a hazard-free workspace.
Collaborate with team members, supervisors, and engineers to ensure timely completion of projects.
Keep accurate records of work performed, materials used, and inspections completed.
Qualifications
Education and Experience:

High school diploma or GED required; technical or trade school certification in welding preferred.
3+ years of experience in welding, fabrication, or a related field.
Proficiency in MIG, TIG, Stick, and Flux Core Welding techniques.
Certifications:

Welding certification (e.g., AWS, ASME, or equivalent) is highly desirable.
OSHA 10/30 or other safety-related certifications (preferred).
Skills and Abilities:

Strong knowledge of welding techniques, tools, and materials.
Ability to read and interpret technical drawings and blueprints.
Strong attention to detail and commitment to producing quality work.
Knowledge of safety protocols and best practices in a welding environment.
Physical ability to lift heavy materials, stand for long periods, and work in various positions and environments.
Strong problem-solving skills and the ability to work independently or as part of a team.
Preferred Qualifications
Experience with specialized welding, such as pipe welding or structural welding.
Familiarity with CNC machines, plasma cutters, or other advanced fabrication tools.
Forklift or heavy equipment operation experience.
What We Offer
Competitive pay and benefits package.
Opportunities for professional growth and training.
Access to state-of-the-art tools and equipment.
A collaborative and supportive work environment.`

const jobDescription2 = `Job Summary
Springfield Elementary School is seeking a passionate and dedicated Elementary School Teacher to join our team. The ideal candidate will create and deliver engaging lesson plans that meet Illinois State Learning Standards while fostering a positive and inclusive learning environment. This role requires strong classroom management skills, the ability to differentiate instruction for diverse learners, and a commitment to student growth and success.

Key Responsibilities
Plan and deliver daily lessons in core subjects, including math, language arts, science, and social studies, aligned with Illinois State Learning Standards.
Foster a supportive and inclusive classroom environment that promotes social and emotional development.
Utilize technology, such as Google Classroom and interactive whiteboards, to enhance student engagement and learning.
Assess and monitor student progress through regular quizzes, assignments, and standardized testing.
Differentiate instruction to accommodate the needs of students with varying abilities, including English language learners and students with IEPs.
Maintain open communication with parents and guardians to discuss student progress and address any concerns.
Collaborate with colleagues and participate in professional development opportunities to enhance teaching practices.
Organize and supervise extracurricular activities, such as clubs, field trips, or school events.
Enforce classroom rules and maintain a safe, respectful learning environment.
Qualifications
Education and Certification:

Bachelor’s degree in Education or a related field (required); Master’s degree in Education (preferred).
Valid Illinois Professional Educator License (PEL) with an endorsement in Elementary Education (required).
ESL or Special Education endorsement (preferred).
Experience:

2+ years of teaching experience in an elementary school setting (preferred).
Experience with differentiated instruction and classroom technology integration (preferred).
Skills and Abilities:

Strong knowledge of elementary education best practices and curriculum development.
Excellent classroom management and student engagement skills.
Proficiency with educational technology tools, such as Google Suite and SmartBoards.
Exceptional communication and interpersonal skills to build relationships with students, parents, and colleagues.
Ability to analyze data and adjust instruction based on student performance.
`

const resumeContent1 = `Professional Summary
Dedicated and detail-oriented welder with 5 years of experience in fabrication, assembly, and repair in industrial and construction environments. Proficient in MIG, TIG, Stick, and Flux Core Welding, with strong skills in blueprint interpretation and equipment maintenance. Committed to safety and delivering high-quality work while meeting deadlines and exceeding expectations.

Certifications and Licenses
Certified Welder (AWS - American Welding Society), 2018
OSHA 30 Certification, 2019
Forklift Operation Certification, 2020
Professional Experience
Welder/Fabricator
Welding Inc., Norfolk, VA — June 2019 – Present

Performed high-precision MIG, TIG, Stick, and Flux Core Welding on steel, aluminum, and stainless steel.
Assembled and repaired metal components based on detailed blueprints and engineering specifications.
Inspected welds for strength, durability, and accuracy, ensuring compliance with AWS standards.
Operated cutting tools, plasma cutters, and grinding equipment for material preparation.
Trained junior welders on safe practices and advanced welding techniques.
Maintained a zero-incident safety record for 4 consecutive years.
Structural Welder
Blue Ridge Fabrication, Richmond, VA — January 2017 – May 2019

Welded and assembled structural components for bridges and high-rise buildings.
Conducted pre-welding material preparation, including grinding and fitting.
Performed quality control checks to ensure all welds met safety and strength standards.
Collaborated with engineers and project managers to ensure projects were completed on schedule.
Key Skills
MIG, TIG, Stick, and Flux Core Welding
Blueprint Reading and Technical Drawing Interpretation
Metal Fabrication and Structural Welding
Plasma Cutting and Material Preparation
Equipment Maintenance and Troubleshooting
OSHA Compliance and Workplace Safety Practices
Strong Attention to Detail and Problem-Solving
Education
Certificate in Welding Technology
Virginia Technical College, Richmond, VA — Graduated May 2017

High School Diploma
Richmond High School, Richmond, VA — Graduated June 2015

Awards and Achievements
"Welder of the Year," Welding Inc., 2021
Recognized for achieving a zero-defect rate on completed welds in 2020 and 2021.
Contributed to the successful completion of a $5 million bridge project two weeks ahead of schedule.
Professional Development
Advanced TIG Welding Techniques Workshop, 2021
Structural Welding and Blueprint Reading Certification, 2020`

const resumeContent2 = `Professional Summary
Passionate and dedicated educator with over 7 years of teaching experience in elementary and middle school classrooms. Skilled in creating engaging lesson plans aligned with state standards and fostering a positive, inclusive learning environment. Proven ability to develop students’ critical thinking and problem-solving skills while promoting social and emotional growth. Adept at using technology to enhance learning and collaborating with parents and colleagues to support student success.

Certifications
State of Illinois Professional Educator License (PEL), Certified in Elementary Education (Grades K-8)
ESL (English as a Second Language) Endorsement, 2020
Google Certified Educator, Level 1, 2021
Professional Experience
5th Grade Teacher
Springfield Elementary School, Springfield, IL — August 2018 – Present

Designed and implemented creative lesson plans aligned with Illinois State Learning Standards.
Integrated technology, including Google Classroom and interactive whiteboards, to enhance student engagement and learning outcomes.
Managed a classroom of 25 students, promoting a positive and inclusive atmosphere.
Assessed and monitored student progress through regular quizzes, assignments, and standardized tests.
Collaborated with colleagues and parents to develop individualized learning plans for students with diverse needs.
Organized extracurricular activities, such as the school’s debate team and science fair projects.
4th Grade Teacher
Lincoln Charter School, Springfield, IL — August 2015 – June 2018

Delivered instruction in core subjects, including math, language arts, science, and social studies, for a classroom of 22 students.
Established a classroom management system to encourage respectful behavior and active participation.
Incorporated hands-on learning activities and group projects to foster critical thinking and teamwork.
Conducted parent-teacher conferences to discuss academic progress and strategies for improvement.
Mentored new teachers as part of the school’s professional development program.
Key Skills
Curriculum Design and Implementation
Classroom Management and Discipline
Differentiated Instruction for Diverse Learners
Proficient in EdTech Tools (Google Suite, SmartBoard, Kahoot)
Strong Communication and Interpersonal Skills
Data-Driven Assessment and Evaluation
Education
Master of Education (M.Ed.) in Curriculum and Instruction
University of Illinois, Urbana-Champaign — Graduated May 2015

Bachelor of Science (B.S.) in Elementary Education
Illinois State University, Normal, IL — Graduated May 2013

Awards and Achievements
“Teacher of the Year,” Springfield Elementary School, 2022
Successfully increased student reading comprehension scores by 20% over three years.
Recognized for innovative use of technology in the classroom by the district in 2021.
Professional Development
Classroom Management Strategies Workshop, 2023
Responsive Classroom Training, 2022
Integrating Technology into the Curriculum, 2021
`

export const demoJobs: Job[] = [
    {
        id: 1,
        role: "Welder",
        company: "Welding Inc",
        jobDescription: lzString.compressToUTF16(jobDescription1),
        location: "Virginia",
        createdAt: "2024-12-11 17:01:48",
        resumeMatch: {
            id: 1,
            jobId: 1,
            status: 'COMPLETE',
            resumeId: 1,
        }
    },
    {
        id: 2,
        role: "Teacher",
        company: "Springfield Elementary School",
        jobDescription: lzString.compressToUTF16(jobDescription2),
        location: "Springfield, IL",
        createdAt: "2024-12-11 17:01:48",
        resumeMatch: {
            id: 2,
            jobId: 2,
            status: 'COMPLETE',
            resumeId: 2
        }
    }
]

export const demoResumes: Resume[] = [
    {
        id: 1,
        name: "Demo Resume 1",
        createdAt: "11/07/2024",
        description: "Welder Resume Version 1",
        role: "Welder",
        content: lzString.compressToUTF16(resumeContent1)
    },
    {
        id: 2,
        name: "Demo Resume 2",
        createdAt: "11/10/2024",
        description: "Teaching Resume Final",
        role: "Teacher",
        content: lzString.compressToUTF16(resumeContent2)
    }
];

export const demoMatches: ResumeMatch[] = [
    {
        id: 1,
        jobId: 1,
        status: 'COMPLETE',
        resumeId: 1,
    },
    {
        id: 2,
        jobId: 2,
        status: 'COMPLETE',
        resumeId: 2
    }
]

export const demoMatchKeywords: string[] = [
    `["professional","summary","welder","years","experience","fabrication","repair","environments","mig","tig","stick","flux","core","welding","strong","skills","equipment","safety","high-quality","work","certifications","aws","osha","certification","forklift","operation","performed","steel","aluminum","stainless","metal","components","blueprints","specifications","welds","strength","durability","ensuring","standards","cutting","tools","plasma","cutters","grinding","practices","advanced","techniques","structural","including","quality","ensure","engineers","project","projects","completed","key","technical","attention","detail","problem-solving","education","virginia","high","school","diploma","completion"]`,
    `["summary","springfield","elementary","school","passionate","dedicated","teacher","team","engaging","lesson","plans","illinois","state","learning","standards","fostering","positive","inclusive","environment","strong","classroom","management","skills","ability","instruction","diverse","learners","student","growth","success","key","core","subjects","including","math","language","arts","science","social","studies","aligned","foster","emotional","development","technology","google","interactive","whiteboards","enhance","engagement","progress","regular","quizzes","assignments","standardized","students","english","communication","parents","discuss","colleagues","professional","teaching","extracurricular","activities","respectful","education","educator","license","pel","endorsement","esl","experience","years","differentiated","curriculum","tools","suite","interpersonal"]`
]