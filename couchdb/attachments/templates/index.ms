<div class="well span12 ">
    
    <form class="pull-right" action="#/user/logout">
        <button type="submit" class="btn">Logout</button>
    </form>

    <table class="table table-striped">
        <th>Seite</th>
        <th>Anzeigedauer</th>
        <th>Aktiv</th>
        <th>Beginn</th>
        <th>Ende</th>
        <th>L&ouml;schen</th>
        {{#rows}}
        
        <tr>
            <form action="#/change/{{id}}" method="post">
                
                <td>{{value.headline}}</td>
                <td>
                    <input type="number" min="1" max="20" step="1" name="duration" value="{{value.duration}}">
                </td>
                <td>
                    <input type="checkbox" name="active" value="true" {{active}}>
                </td>
                <td>
                    <input type="datetime-local" name="published.1" value="{{value.published.1}}">
                </td>
                <td>
                    <input type="datetime-local" name="published.2" value="{{value.published.2}}">
                </td>
                <td>
                    <a class="btn btn-danger" href="#/delete/{{id}}/{{value._rev}}"><i class="icon-remove icon-white"></i></a>
                    <button type="submit" class="btn">Speichern</button>
                </td>
            </form>
        </tr>
        
        {{/rows}}
        <tr>
            <td colspan="6">
                <h2>Neuer Eintrag</h2>
            </td>
        </tr>
        <tr>
            <form action="#/new" method="post" enctype="multipart/form-data">
                
                <td>
                    <input type="text" name="headline"><br>
                    <input type="file" name="_attachments" accept="image/*">
                </td>
                <td>
                    <input type="number" min="1" max="120" step="1" name="duration">
                </td>
                <td>
                    <input type="checkbox" name="active" value="true">
                </td>
                <td>
                    <input type="datetime-local" name="published.1">
                </td>
                <td>
                    <input type="datetime-local" name="published.2">
                </td>
                <td>
                    <button type="submit" class="btn">Speichern</button>
                </td>
            </form>
        </tr>
        <tr>
            <td colspan="6">
                <h2>Twitter</h2>
            </td>
        </tr>
        <tr>
            <form action="#/twitter/change/{{searchstringrev}}" method="put">
                <td colspan="3">
                    <input type="text" name="twitter-search-string" class="span6" value="{{searchstring}}">
                </td>
                <td colspan="1">
                    <button type="submit" class="btn">Speichern</button>
                </td>
            </form>
                <td>
                    <a href="#/tweets/delete" class="btn btn-danger">Tweets löschen</a>
                </td>
        </tr>
    </table>
</div>