//Find all the topics and tasks which are thought in the month of October
db.topics.find({date:{$gte:ISODate("2020-10-12T00:00:00Z"),$lte:ISODate("2020-10-28T00:00:00Z")}});


//Find all the company drives which appeared between 15 oct-2020 and 31-oct-2020
db.createCollection("drives")

db.drives.insertMany([
  { company: "CompanyA", course: "computer", drive_date: new Date("2020-10-16") },
  { company: "CompanyB", course: "mechanical", drive_date: new Date("2020-10-17") },
  { company: "CompanyC", course: "computer", drive_date: new Date("2020-10-20") },
  { company: "CompanyD", course: "electrical", drive_date: new Date("2020-10-22") },
  { company: "CompanyE", course: "computer", drive_date: new Date("2020-10-25") }
])
db.drives.find({ 
  course: "computer",
  drive_date: {
    $gte: new Date("2020-10-15"),
    $lte: new Date("2020-10-31")
  }
}).pretty()

//Find all the company drives and students who are appeared for the placement.

//Find the number of problems solved by the user in codekata
db.codekata.aggregate({$project:{
    name:1,_id:0,
    solved_problems:{
    $add:["$Input/Output","$Absolute_beginner","$Array","$mathematics","$strings"]
    }
  }})


//  Find all the mentors with who has the mentee's count more than 15
db.mentors.find({mentee:{$gte:15}},{_id:0,name:1,role:1,mentee:1})


//Find the number of users who are absent and task is not submitted  between 15 oct-2020 and 31-oct-2020
db.attendance.aggregate([
  {
    $match: {
      date: {
        $gte: "2020-10-15",
        $lte: "2020-10-31"
      },
      status: "absent"
    }
  },
  {
    $group: {
      _id: "$user_id"
    }
  },
  {
    $out: "absent_users"
  }
]);

db.tasks.aggregate([
  {
    $match: {
      date: {
        $gte: "2020-10-15",
        $lte: "2020-10-31"
      },
      status: "not submitted"
    }
  },
  {
    $group: {
      _id: "$user_id"
    }
  },
  {
    $out: "not_submitted_users"
  }
]);

db.absent_users.aggregate([
  {
    $lookup: {
      from: "not_submitted_users",
      localField: "_id",
      foreignField: "_id",
      as: "matched_users"
    }
  },
  {
    $match: {
      matched_users: { $ne: [] }
    }
  },
  {
    $limit: 5
  },
  {
    $project: {
      user_id: "$_id",
      _id: 0
    }
  }
]).forEach(printjson);

