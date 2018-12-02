const {
    COURSES,
} = require('../src/utils.js');

const render = (current_user) => {

    // group courses by department
    const getDept = courseName => courseName.split(' ')[0];
    const courseGroups = {};
    for (const [slug, name] of Object.entries(COURSES)) {
        const dept = getDept(name);
        if (!(dept in courseGroups)) {
            courseGroups[dept] = [];
        }
        courseGroups[dept].push([slug, name]);
    }

    return `
      <h1 class="vprop">
        Let's find <em>you</em> a Studybuddy.
      </h1>
      <div class="inputGroup required">
        <label for="user_class">
          <h2>What class do you want a studybuddy for?</h2>
        </label>
        <select name="user_class" id="user_class">
          <option value="" selected>-- Choose one --</option>
          ${
            Object.entries(courseGroups).map(([dept, courses]) => {
                return `
                    <optgroup label="${dept}">
                    ${
                    courses.map(([slug, name]) =>
                        `<option value="${slug}">${name}</option>`).join('')
                    }
                    </optgroup>
                `;
            }).join('\n')
          }
        </select>
      </div>
      <div class="inputGroup required">
        <label for="user_level">
          <h2>How are you doing in that class?</h2>
        </label>
        <select name="user_level" id="user_level">
          <option value="1">I'm lost, and I need help</option>
          <option value="3" selected>Okay, but could use some help</option>
          <option value="5">Great, but want to do better</option>
        </select>
      </div>
      <div class="inputGroup required">
        <label for="user_topic">
          <h2>What do you want help on? Studying for exams? Homework? Just studying?</h2>
        </label>
        <input type="text" name="user_topic">
      </div>
      <div class="inputGroup">
        <button class="submitButton">Submit</button>
      </div>
      <script src="/static/js/new_request.js"></script>
    `;
}

module.exports = render;

