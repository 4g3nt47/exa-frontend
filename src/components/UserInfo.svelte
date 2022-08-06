<script>

  /**
   * @file Displays some info about a user.
   * @author Umar Abdul (https://github.com/4g3nt47)
   * Props:
   *        session - The session object.
   *        profile - The user profile.
   */

  export let session = {};
  export let profile = {};  

</script>

<div class="flex items-center">
  <img class="profile-avatar border-gray-700" src={session.api + "/" +  profile.avatar} alt="My avatar">
  <div class="ml-2 w-full">
    <table>
      <tr>
        <th>Username:</th>
        <td>{profile.username}</td>
      </tr>
      <tr>
        <th>Name:</th>
        <td>{profile.name}</td>
      </tr>
      <tr>
        <th>Joined On:</th>
        <td>{new Date(profile.creationDate).toLocaleString()}</td>
      </tr>
      <tr>
        <th>Active Tests:</th>
        <td>{profile.activeTests}</td>
      </tr>
      <tr>
        <th>Tests Taken:</th>
        <td>{profile.testsTaken}</td>
      </tr>
      <tr>
        <th>Tests Passed:</th>
        <td>
          {profile.testsPassed} ({(profile.testsTaken === 0 ? 0 : (profile.testsPassed / profile.testsTaken) * 100).toFixed(2)}% success rate)
        </td>
      </tr>
    </table>
  </div>        
</div>

<style>
  .profile-avatar{
    width: 150px;
    height: 150px;
    border-radius: 10px;
    border: none;
  }

  table{
    width: 100%;
  }

  table th{
    text-align: left;
    padding-right: 10px;
    width: 150px;
  }

  table tr:nth-child(even){
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    background-color: #e7e7e7;
  }
</style>
